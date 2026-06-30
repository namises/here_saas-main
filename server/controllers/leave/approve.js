import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import mongoose from "mongoose";
import { objectIdValidator, now } from "../../utils/index.js";
import { sendNotification } from "../../utils/firebase.js";

async function handler(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { organization, employee, manager } = req.user;
    const { leaveId } = req.body;
    const status = "approved";
    const leaveRequest = await DB.LeaveRequest.findOne({ _id: leaveId, organization }).populate({ path: "employee", select: "name leaveBalances" });
    if (!leaveRequest) throw new Error("Leave request not found");

    // Super admins/admins (employee.read) can act on ANY leave; otherwise only the assigned approver (owner).
    const isAdminApprover = req.user.isSuperAdmin || (req.user.permissions || []).includes("employee.read");
    if (!isAdminApprover && `${leaveRequest.owner}` !== employee) throw new Error("You cannot approve this leave");
    if (leaveRequest.status !== "pending") throw new Error("Leave request already processed");
    const leaveBalances = leaveRequest.employee.leaveBalances;
    if (!leaveBalances || !leaveBalances.length) throw new Error("Leave not available");
    const optedLeave = leaveBalances.find((leave) => leave.leaveType === leaveRequest.leaveType);
    if (!optedLeave) throw new Error("Leave type not available");
    const days = leaveRequest.days;
    if (optedLeave.used + days > optedLeave.credited + optedLeave.carryForwarded) throw new Error("Leave days exceeded the available leaves");
    await DB.LeaveRequest.updateOne({ _id: leaveId }, { $set: { status, owner: manager, approvedBy: employee, actionedAt: now() } }, { session });
    await DB.Employee.updateOne({ _id: leaveRequest.employee._id, organization }, { $set: { "leaveBalances.$[elem].used": optedLeave.used + days } }, { arrayFilters: [{ "elem.leaveType": leaveRequest.leaveType }], session });
    await session.commitTransaction();
    session.endSession();
    // notify employee
    sendNotification(employee, "Leave Approved", `Your leave request from ${leaveRequest?.fromDate} to ${leaveRequest?.toDate} is Approved`, null, `${process.env.CLIENT_URI}/leaves`);
    return handleResponse(res, { message: "Leave approoved Successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({ leaveId: objectIdValidator.required() });
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
