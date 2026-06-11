import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { employee } = req.user;
    const { attendanceRequestId, comments } = req.body;
    const request = await DB.AttendanceRequest.findById(attendanceRequestId);
    if (!request) throw new Error("Attendance request doesn't exist");
    if (["approved", "rejected"].includes(request.status)) throw new Error("Already " + request.status);
    if (`${request.owner}` === employee) throw new Error("Not authorized to reject");
    request.status = "rejected";
    request.comments = comments;
    await request.save();
    // Notify Employee
    return handleResponse(res, { message: "Attendance req rejected successfully" });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({ attendanceRequestId: objectIdValidator.required(), comments: Joi.string().required() });
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
