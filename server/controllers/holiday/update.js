import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { getFinancialYearFromUnix, objectIdValidator, timestampValidator } from "../../utils/index.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { holidayId, name, date, remarks } = req.body;
    const locale = req.headers["x-locale"];
    const existingHoliday = await DB.Holiday.findOne({ _id: holidayId, organization });
    if (!existingHoliday) throw new Error("Holiday does not exists");
    if (name) existingHoliday.name = name;
    if (date) {
      const financialYears = getFinancialYearFromUnix(date, locale);
      existingHoliday.date = date;
      existingHoliday.financialYear = financialYears[0];
    }
    if (remarks) existingHoliday.remarks = remarks;

    const holiday = await existingHoliday.save();
    return handleResponse(res, { message: "Holiday updated successfully", holiday });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  holidayId: objectIdValidator.required(),
  name: Joi.string(),
  date: timestampValidator,
  remarks: Joi.string(),
});

const validation = { schema, toValidate: toValidateOptions.body };

export default { handler, validation };
