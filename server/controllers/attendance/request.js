import Joi from "joi";
import mongoose from "mongoose";
import DB from "../../db/index.js";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { timestampValidator, objectIdValidator } from "../../utils/index.js";
import { sendNotification } from "../../utils/firebase.js";

async function handler(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { organization, manager } = req.user;
    const { attendanceId, checkIn, checkOut, reason } = req.body;
    const attendanceDoc = await DB.Attendance.findById(attendanceId).populate({ path: "employee", select: "name" });
    if (!attendanceDoc) throw new Error("Attendance doesn't exist");
    const existing = await DB.AttendanceRequest.findOne({
      attendance: attendanceId,
      organization,
    });
    if (existing) throw new Error("Request already exists");
    await DB.AttendanceRequest.create([{ organization, attendance: attendanceId, owner: manager, checkIn, checkOut, reason }], { session });
    await DB.Attendance.findByIdAndUpdate(attendanceId, { requested: true }, { session });
    await session.commitTransaction();
    session.endSession();
    // Notify Manager
    sendNotification(manager, "New Attendance Request", `${attendanceDoc?.employee?.name ?? "Someone"} has requested for attendance Update`, null, `${process.env.CLIENT_URI}/attendance`);
    return handleResponse(res, { message: "Attendance req created successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  attendanceId: objectIdValidator.required(),
  checkIn: timestampValidator.required(),
  checkOut: timestampValidator.required(),
  reason: Joi.string().required(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
