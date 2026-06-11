import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { timestampValidator, objectIdValidator } from "../../utils/index.js";
import { sendNotification } from "../../utils/firebase.js";

async function handler(req, res) {
  try {
    const { organization, employee, manager } = req.user;
    const { leaveId, leaveType, fromDate, toDate, reason } = req.body;
    const leave = await DB.LeaveRequest.findOne({ _id: leaveId, organization });
    if (!leave) throw new Error("Leave request not found");
    if (`${leave.employee}` !== employee) throw new Error("You cannot update this leave");
    if (leave.status !== "pending") throw new Error("Leave request already processed");
    if (leave.fromDate === fromDate && leave.toDate === toDate && leave.leaveType === leaveType && leave.reason === reason) throw new Error("No changes made");
    if (fromDate > toDate) throw new Error("From date should be less than to date");
    if (fromDate < Math.floor(Date.now() / 1000)) throw new Error("From date should be greater than current date");
    if (toDate < Math.floor(Date.now() / 1000)) throw new Error("To date should be greater than current date");
    if (fromDate > toDate) throw new Error("From date should be less than to date");
    const days = Math.ceil((toDate - fromDate) / (60 * 60 * 24)) + 1; // in seconds
    if (days <= 0) throw new Error("Minimum leave days is 1");
    const employeeDoc = await DB.Employee.findOne({ _id: employee, organization });
    if (!employeeDoc) throw new Error("Employee not found");
    const leaveBalances = employeeDoc.leaveBalances;
    if (!leaveBalances || !leaveBalances.length) throw new Error("Leave not available");
    const optedLeave = leaveBalances.find((leave) => leave.leaveType === leaveType);
    if (!optedLeave) throw new Error("Leave type not available");
    if (optedLeave.used + days > optedLeave.credited + optedLeave.carryForwarded) throw new Error("Leave days exceeded the available leaves");
    const update = Object.entries({ days, leaveType, fromDate, toDate, reason }).reduce((a, [k, v]) => (v ? { ...a, [k]: v } : a), {});
    await DB.LeaveRequest.updateOne({ _id: leaveId }, update);
    // notify owner
    sendNotification(manager, "Leave Request Updated", `${employeeDoc?.name} has updated a Leave Request `, null, `${process.env.CLIENT_URI}/leaves`);
    return handleResponse(res, { message: "Leave request updated Successfully" });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  leaveId: objectIdValidator.required(),
  leaveType: Joi.string().optional(),
  fromDate: timestampValidator.optional(),
  toDate: timestampValidator.optional(),
  reason: Joi.string().max(256).optional(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
