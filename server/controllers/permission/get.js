import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";

async function handler(req, res) {
  try {
    return handleResponse(res, {
      message: "Permissions fetched successfully",
      permissions,
    });
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
