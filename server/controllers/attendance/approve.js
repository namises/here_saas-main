import mongoose from "mongoose";
import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { timestampValidator, objectIdValidator } from "../../utils/index.js";

async function handler(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { organization, employee } = req.user;
    const { attendanceRequestId: _id, checkIn, checkOut, reason, status, comments } = req.body;
    const request = await DB.AttendanceRequest.findOne({ _id, organization });
    if (!request) throw new Error("Attendance request doesn't exist");
    if (["approved", "rejected"].includes(request.status)) throw new Error("Already " + request.status);
    if (`${request.owner}` !== employee) throw new Error("Not authorized to approve");
    // update attendance
    const attendanceDoc = await DB.Attendance.findOne({ _id: request.attendance, organization });
    if (!attendanceDoc) throw new Error("Attendance doesn't exist");
    if (!attendanceDoc.requested) throw new Error("Attendance not requested");
    attendanceDoc.checkIn = checkIn;
    attendanceDoc.checkOut = checkOut;
    attendanceDoc.status = status;

    await attendanceDoc.save();
    // update attendance Request status
    request.checkIn = checkIn;
    request.checkOut = checkOut;
    request.reason = reason;
    request.comments = comments;
    request.status = "approved";
    await request.save();
    await session.commitTransaction();
    session.endSession();
    // Notify Employee
    return handleResponse(res, { message: "Attendance req approved successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  attendanceRequestId: objectIdValidator.required(),
  checkIn: timestampValidator.required(),
  checkOut: timestampValidator.required(),
  status: Joi.string().valid("present", "half-day", "absent", "leave", "holiday", "week_off").required(),
  reason: Joi.string().required(),
  comment: Joi.string().optional(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
