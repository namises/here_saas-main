import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { timestampValidator, objectIdValidator, validatePassword, PAN_REGEX, FILE_URL_REGEX } from "../../utils/index.js";
import permissionsPresets from "../../utils/permissionsPresets.js";
import { token } from "morgan";

async function handler(req, res) {
  try {
    const { employee } = req.user;
    const { fcmToken } = req.body;
    await DB.FCM.addToken(employee, fcmToken);
    return handleResponse(res, { message: "Token Updated successfully." });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  fcmToken: Joi.string().required(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
