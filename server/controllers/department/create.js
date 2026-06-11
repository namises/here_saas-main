import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { name, code, description } = req.body;
    const existing = await DB.Department.findOne({
      $or: [
        { name, organization },
        { code, organization },
      ],
    });
    if (existing) throw new Error("Department with name or code already exists");
    const department = await DB.Department.create({ name, code, description, organization });
    return handleResponse(res, { message: "department created Successfully", department });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  //
  name: Joi.string().min(2).max(64).required(),
  code: Joi.string().min(2).max(16).required(),
  description: Joi.string().max(256).optional(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
