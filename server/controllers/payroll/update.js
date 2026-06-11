import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { objectIdValidator } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization, matchedPermissions } = req.user;
    const { payrollId, month, status, presentDays, totalWorkingDays, remarks, components } = req.body;

    if (!matchedPermissions.includes(permissions.payroll.update)) {
      throw new Error(errorStrings.notPermitted);
    }

    if (!payrollId) throw new Error("payrollId is required");
    // Fetch payroll document
    const payrollDoc = await DB.Payroll.findOne({ _id: payrollId, organization });
    if (!payrollDoc) throw new Error("Payroll record not found");

    // Build update payload dynamically
    const updatePayload = {};
    if (month) updatePayload.month = month;
    if (status) updatePayload.status = status;
    if (presentDays !== undefined) updatePayload.presentDays = presentDays;
    if (totalWorkingDays !== undefined) updatePayload.totalWorkingDays = totalWorkingDays;
    if (remarks !== undefined) updatePayload.remarks = remarks;
    if (components) {
      if (!Array.isArray(components)) throw new Error("components must be an array");
      updatePayload.components = components;
    }

    // Recalculate grossSalary and netSalary if components or attendance updated
    if (updatePayload.components || presentDays !== undefined || totalWorkingDays !== undefined) {
      const comps = updatePayload.components || payrollDoc.components;
      const grossAnnual = comps.reduce((sum, c) => sum + c.amount, 0);
      const monthlyGross = grossAnnual / 12;

      const present = presentDays !== undefined ? presentDays : payrollDoc.presentDays;
      const working = totalWorkingDays !== undefined ? totalWorkingDays : payrollDoc.totalWorkingDays;
      const attendanceRatio = working > 0 ? present / working : 1;
      updatePayload.grossSalary = monthlyGross;
      updatePayload.netSalary = monthlyGross * attendanceRatio;
    }

    // Execute update and return updated doc
    const updatedPayroll = await DB.Payroll.findByIdAndUpdate(payrollId, updatePayload, { new: true });
    return handleResponse(res, {
      message: "Payroll updated successfully",
      updatedPayroll,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  payrollId: objectIdValidator.required(),
  month: Joi.string().valid("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December").optional(),
  status: Joi.string().valid("pending", "processed").optional(),
  presentDays: Joi.number().min(0).optional(),
  totalWorkingDays: Joi.number().min(0).optional(),
  remarks: Joi.string().allow("", null).optional(),
  components: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        inHandComponent: Joi.boolean().optional(),
      })
    )
    .optional(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
