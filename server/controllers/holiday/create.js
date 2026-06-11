import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { getFinancialYearFromUnix, timestampValidator } from "../../utils/index.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { name, date, remarks } = req.body;
    const locale = req.headers["x-locale"];
    const holidayExists = await DB.Holiday.findOne({ $or: [{ name }, { date }] });
    if (holidayExists) throw new Error("Holiday exists with the same name or date");
    const financialYears = getFinancialYearFromUnix(date, locale);
    const financialYear = financialYears[0];
    const holiday = await DB.Holiday.create({ organization, name, date, remarks, financialYear });
    return handleResponse(res, { message: "Holiday created successfully", holiday });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  name: Joi.string().required(),
  date: timestampValidator.required(),
  remarks: Joi.string(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
