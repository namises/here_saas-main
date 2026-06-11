import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const orgDoc = await DB.Organization.findById(organization).select("name domain address email mobile attendancePunchType logo").lean();
    if (!orgDoc) throw new Error("Organization not found");
    return handleResponse(res, { message: "Settings fetched successfully", settings: orgDoc });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

const schema = Joi.object({});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
