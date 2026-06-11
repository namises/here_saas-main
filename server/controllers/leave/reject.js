import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";
import { sendNotification } from "../../utils/firebase.js";

async function handler(req, res) {
  try {
    const { organization, employee, manager } = req.user;
    const { leaveId } = req.body;
    const status = "rejected";
    const leaveRequest = await DB.LeaveRequest.findOne({ _id: leaveId, organization }).populate({ path: "employee", select: "name leaveBalances" });
    if (!leaveRequest) throw new Error("Leave request not found");
    if (`${leaveRequest.owner}` !== employee) throw new Error("You cannot reject this leave");
    if (leaveRequest.status !== "pending") throw new Error("Leave request already processed");
    await DB.LeaveRequest.updateOne({ _id: leaveId }, { status, owner: manager });
    // notify employee
    sendNotification(employee, "Leave Rejected", `Your leave request from ${leaveRequest?.fromDate} to ${leaveRequest?.toDate} is Rejected`, null, `${process.env.CLIENT_URI}/leaves`);
    return handleResponse(res, { message: "Leave rejected" });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({ leaveId: objectIdValidator.required() });
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
