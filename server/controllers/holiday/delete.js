import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { holidayId } = req.body;
    await DB.Holiday.findOneAndDelete({ _id: holidayId, organization });
    return handleResponse(res, { message: "Holiday deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  holidayId: objectIdValidator.required(),
});

const validation = { schema, toValidate: toValidateOptions.body };

export default { handler, validation };
