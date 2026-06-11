import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const workDays = await DB.Workdays.findOne({ organization });
    if (!workDays) throw new Error("Workdays information not found");

    return handleResponse(res, { message: "Workdays Fetched successfully", workDays: workDays.workDays });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
