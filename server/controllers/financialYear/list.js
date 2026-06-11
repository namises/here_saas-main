import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js"; // Ensure FinancialYear is exported from DB
import { toValidateOptions } from "../../middlewares/validator.js";
import { getFinancialYearFromUnix } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const locale = req.headers["x-locale"];
    const org = await DB.Organization.findById(organization);
    const createdAt = new Date(org.createdAt);
    const utcTimestamp = Math.floor(createdAt.getTime() / 1000);
    const financialYears = getFinancialYearFromUnix(utcTimestamp, locale);

    return handleResponse(res, {
      message: "Financial years fetched successfully",
      financialYears,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// No input schema needed unless filtering/sorting in future
const validation = {
  schema: Joi.object({}),
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
