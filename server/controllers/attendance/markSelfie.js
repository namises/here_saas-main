import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { now } from "../../utils/index.js";
import dayjs from "dayjs";
import { storeDataUrl } from "../../utils/mediaStorage.js";

async function handler(req, res) {
  try {
    const { organization, employee } = req.user;
    const { lat, lng, selfie } = req.body;

    const orgDoc = await DB.Organization.findById(organization).lean();
    if (!["selfie", "both"].includes(orgDoc.attendancePunchType)) {
      throw new Error("Selfie punch-in is not enabled for this organization");
    }

    // Store the selfie (base64 data URL) — Cloudinary if configured, else local disk.
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const selfieUrl = await storeDataUrl(selfie, { folder: "selfies", baseUrl });

    const currentTime = now();
    const pastWindow = dayjs(currentTime * 1000).subtract(24, "hour").unix();

    const existingAttendance = await DB.Attendance.findOne({
      organization,
      employee,
      checkIn: { $gte: pastWindow },
      checkOut: null,
    });

    if (existingAttendance) {
      const employeeDoc = await DB.Employee.findById(employee).lean();
      const shiftDoc = await DB.Shift.findById(employeeDoc.shift);
      if (!shiftDoc) throw new Error("Shift not assigned");

      const shiftStart = dayjs
        .unix(existingAttendance.checkIn)
        .startOf("day")
        .add(dayjs(shiftDoc.startTime, "HH:mm").hour(), "hour")
        .add(dayjs(shiftDoc.startTime, "HH:mm").minute(), "minute");
      let shiftEnd = dayjs
        .unix(existingAttendance.checkIn)
        .startOf("day")
        .add(dayjs(shiftDoc.endTime, "HH:mm").hour(), "hour")
        .add(dayjs(shiftDoc.endTime, "HH:mm").minute(), "minute");

      if (shiftDoc.isOvernight && shiftEnd.isBefore(shiftStart)) {
        shiftEnd = shiftEnd.add(1, "day");
      }

      const totalExpectedMinutes = shiftEnd.diff(shiftStart, "minute");
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
      existingAttendance.checkOutLocation = { lat, lng };
      existingAttendance.selfie = { ...existingAttendance.selfie?.toObject?.() ?? {}, checkOut: selfieUrl };
      await existingAttendance.save();

      return handleResponse(res, {
        message: "Attendance checkOut marked successfully",
        checkOut: currentTime,
        status,
        workMinutes,
      });
    } else {
      const existingSameDayAttendance = await DB.Attendance.findOne({
        organization,
        employee,
        checkIn: { $gte: pastWindow },
      });
      if (existingSameDayAttendance) throw new Error("Todays Attendance already marked");

      await DB.Attendance.create({
        organization,
        employee,
        date: currentTime,
        checkIn: currentTime,
        location: { lat, lng },
        selfie: { checkIn: selfieUrl },
        punchType: "selfie",
      });

      return handleResponse(res, {
        message: "Attendance checkIn marked successfully",
        checkIn: currentTime,
      });
    }
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

const schema = Joi.object().keys({
  selfie: Joi.string().required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
});

const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
