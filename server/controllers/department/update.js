import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator, sanitizeObject } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { departmentId: _id, name, code, description } = req.body;
    const exists = await DB.Department.findOne({ _id, organization });
    if (!exists) throw new Error("Department does not exists");
    const updatePayload = sanitizeObject({ name, code, description });
    const department = await DB.Department.findByIdAndUpdate(_id, updatePayload, { new: true });
    return handleResponse(res, { message: "Department updated successfully", department });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  //
  departmentId: objectIdValidator.required(),
  name: Joi.string().min(2).max(64).optional(),
  code: Joi.string().alphanum().min(2).max(16).optional(),
  description: Joi.string().max(256).optional(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
