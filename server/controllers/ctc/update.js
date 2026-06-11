import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator, validateFinancialYear } from "../../utils/index.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom } = req.body;

    const ctc = await DB.CTC.findOne({ _id: ctcId, organization });
    if (!ctc) throw new Error("CTC not found or access denied");

    const employeeExists = await DB.Employee.findOne({ _id: employee, organization });
    if (!employeeExists) throw new Error("Invalid employee or organization mismatch");

    const totalEarings = earnings?.reduce((sum, comp) => sum + comp.annualAmount, 0) || 0;
    const totalDeductions = deductions?.reduce((sum, comp) => sum + comp.annualAmount, 0) || 0;
    const totalCTC = totalEarings + totalDeductions;

    console.log({ totalCTC, totalDeductions, totalEarings });

    ctc.employee = employee;
    ctc.financialYear = financialYear;
    ctc.earnings = earnings;
    ctc.deductions = deductions;
    ctc.totalCTC = totalCTC;
    ctc.remarks = remarks;
    if (effectiveFrom) ctc.effectiveFrom = effectiveFrom;

    await ctc.save();

    return handleResponse(res, {
      message: "CTC updated successfully",
      ctc,
    });
  } catch (error) {
    return handleError(res, error);
  }
}
const componentSchema = Joi.object({
  name: Joi.string().required(),
  annualAmount: Joi.number().positive().required(),
  type: Joi.string().valid("earnings", "deductions").default("earnings"),
  inHandComponent: Joi.boolean().default(true),
});

const schema = Joi.object({
  ctcId: objectIdValidator.required(),
  employee: objectIdValidator.required(),
  financialYear: validateFinancialYear.required(),
  earnings: Joi.array().items(componentSchema).min(1).required(),
  deductions: Joi.array().items(componentSchema),
  remarks: Joi.string().allow("", null),
  effectiveFrom: Joi.number().optional(), // UNIX timestamp in seconds
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
