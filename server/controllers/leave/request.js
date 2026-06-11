import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { timestampValidator } from "../../utils/index.js";
import { sendNotification } from "../../utils/firebase.js";

async function handler(req, res) {
  try {
    const { organization, employee, manager } = req.user;
    const { leaveType, fromDate, toDate, reason } = req.body;
    const status = "pending";
    const days = Math.ceil((toDate - fromDate) / (60 * 60 * 24)) + 1; // in seconds
    if (days <= 0) throw new Error("Minimum leave days is 1");
    const employeeDoc = await DB.Employee.findOne({ _id: employee, organization });
    if (!employeeDoc) throw new Error("Employee not found");
    const leaveBalances = employeeDoc.leaveBalances;
    if (!leaveBalances || !leaveBalances.length) throw new Error("Leave not available");
    const optedLeave = leaveBalances.find((leave) => leave.leaveType === leaveType);
    if (!optedLeave) throw new Error("Leave type not available");
    if (optedLeave.used + days > optedLeave.credited + optedLeave.carryForwarded) throw new Error("Leave days exceeded the available leaves");
    await DB.LeaveRequest.create({ organization, employee, fromDate, toDate, leaveType, days, status, reason, owner: manager });
    // notify owner
    sendNotification(manager, "New Leave Request", `${employeeDoc?.name} has requested for Leave `, null, `${process.env.CLIENT_URI}/leaves`);
    return handleResponse(res, { message: "Leave applied Successfully" });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  //
  leaveType: Joi.string().required(),
  fromDate: timestampValidator.required(),
  toDate: timestampValidator.required(),
  reason: Joi.string().max(256).optional(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
