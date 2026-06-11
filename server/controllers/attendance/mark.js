import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { now } from "../../utils/index.js";
import dayjs from "dayjs";
import { authenticator } from "otplib";

async function handler(req, res) {
  try {
    const { organization, employee } = req.user;
    const { code, lat, lng } = req.body;

    // Validate the attendance code
    const attendanceCodeDoc = await DB.AttendanceCode.findOne({ organization });
    const employeeDoc = await DB.Employee.findById(employee).populate("shift").lean();
    const secret = attendanceCodeDoc.secret;
    const isValid = authenticator.verify({
      token: code,
      secret,
    });

    if (!isValid) throw new Error("Incorrect code");
    const currentTime = now();
    // Look for existing check-in with no check-out in past 36 hours (covers overnight shifts)
    const pastWindow = dayjs(currentTime * 1000)
      .subtract(24, "hour")
      .unix();
    const existingAttendance = await DB.Attendance.findOne({
      organization,
      employee,
      checkIn: { $gte: pastWindow },
      checkOut: null,
    });

    if (existingAttendance) {
      const shiftDoc = await DB.Shift.findById(employeeDoc.shift);
      if (!shiftDoc) throw new Error("Shift not assigned");

      const shiftStart = dayjs.unix(existingAttendance.checkIn).startOf("day").add(dayjs(shiftDoc.startTime, "HH:mm").hour(), "hour").add(dayjs(shiftDoc.startTime, "HH:mm").minute(), "minute");
      let shiftEnd = dayjs.unix(existingAttendance.checkIn).startOf("day").add(dayjs(shiftDoc.endTime, "HH:mm").hour(), "hour").add(dayjs(shiftDoc.endTime, "HH:mm").minute(), "minute");

      if (shiftDoc.isOvernight && shiftEnd.isBefore(shiftStart)) {
        shiftEnd = shiftEnd.add(1, "day");
      }

      const totalExpectedMinutes = shiftEnd.diff(shiftStart, "minute");
      // const graceAdjustedStart = shiftStart.add(shiftDoc.gracePeriodMins || 0, "minute");  // planning to use it in future for grace period handling

      const workSeconds = currentTime - existingAttendance.checkIn;
      const workMinutes = Math.floor(workSeconds / 60);

      let status = "absent";
      if (workMinutes >= (shiftDoc.minFullDayDuration || totalExpectedMinutes)) {
        status = "present";
      } else if (workMinutes >= (shiftDoc.minHalfDayDuration || totalExpectedMinutes / 2)) {
        status = "half-day";
      }

      existingAttendance.checkOut = currentTime;
      existingAttendance.status = status;
      await existingAttendance.save();

      return handleResponse(res, {
        message: "Attendance checkOut marked successfully",
        checkOut: currentTime,
        status,
        workMinutes,
      });
    } else {
      // Perform check-in
      const existingSameDayAttendance = await DB.Attendance.findOne({
        organization,
        employee,
        checkIn: { $gte: pastWindow },
      });
      if (existingSameDayAttendance) throw new Error("Todays Attendance already marked");
      const checkInData = {
        organization,
        employee,
        date: currentTime,
        checkIn: currentTime,
        location: { lat, lng },
      };
      await DB.Attendance.create(checkInData);

      return handleResponse(res, {
        message: "Attendance checkIn marked successfully",
        checkIn: currentTime,
      });
    }
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

// Validation schema without "type"
const schema = Joi.object().keys({
  code: Joi.string().required().length(6),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
