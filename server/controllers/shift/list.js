import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const shifts = await DB.Shift.find({ organization });
    return handleResponse(res, { message: "Shifts fetched successfully", shifts });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
