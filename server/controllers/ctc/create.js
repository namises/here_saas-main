import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { getFinancialYearFromUnix, objectIdValidator, timestampValidator, validateFinancialYear } from "../../utils/index.js";
import DB from "../../db/index.js";
import mongoose from "mongoose";

async function handler(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { organization } = req.user;
    const locale = req.headers["x-locale"];
    const org = await DB.Organization.findById(organization);
    const createdAt = new Date(org.createdAt);
    const utcTimestamp = Math.floor(createdAt.getTime() / 1000);
    const financialYears = getFinancialYearFromUnix(utcTimestamp, locale);
    const current = financialYears[financialYears.length - 1];
    const { employee, financialYear = current, earnings, deductions, remarks, effectiveFrom } = req.body;
    const employeeExists = await DB.Employee.findOne({ _id: employee, organization });
    if (!employeeExists) throw new Error("Invalid employee or organization mismatch");
    const existingCTC = await DB.CTC.findOne({ organization, employee, effectiveTill: null });
    if (existingCTC) {
      existingCTC.effectiveTill = effectiveFrom - 24 * 60 * 60; //this ww will set to previous day
      await existingCTC.save({ session });
    }

    const totalEarings = earnings?.reduce((sum, comp) => sum + comp.annualAmount, 0) || 0;
    const totalDeductions = deductions?.reduce((sum, comp) => sum + comp.annualAmount, 0) || 0;
    const totalCTC = totalEarings + totalDeductions;
    console.log({ totalCTC, totalDeductions, totalEarings });
    const ctc = new DB.CTC({
      organization,
      employee,
      financialYear,
      earnings,
      deductions,
      totalCTC,
      remarks,
      effectiveFrom,
    });

    await ctc.save({ session });
    await session.commitTransaction();
    session.endSession();
    return handleResponse(res, {
      message: "CTC created successfully",
      ctc,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
  employee: objectIdValidator.required(),
  financialYear: validateFinancialYear,
  earnings: Joi.array().items(componentSchema).min(1).required(),
  deductions: Joi.array().items(componentSchema),
  remarks: Joi.string().allow("", null),
  effectiveFrom: timestampValidator.required(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
