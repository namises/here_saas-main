import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import DB from "../../db/index.js";
import { validateFinancialYear } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { financialYear } = req.queryParams;

    const query = { organization };
    if (financialYear) query.financialYear = financialYear;
    const holidays = await DB.Holiday.find(query);
    return handleResponse(res, { message: "Holidays fetched successfully", holidays });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({ financialYear: validateFinancialYear });
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
