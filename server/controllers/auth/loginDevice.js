import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator, validateUUIDv4 } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { login, pass, org, id } = req.body;
    const organization = await DB.Organization.findById(org);
    if (!organization) throw new Error("Organization not found");
    const device = await DB.AttendanceCode.findOne({ _id: id, organization: org, deviceId: login, loginPassword: pass });
    if (!device) throw new Error("No Such device registered");
    const secret = device.secret;
    return handleResponse(res, { message: "Logged in successfully", secret, logo: organization.logo, name: organization.name });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({ login: validateUUIDv4.required(), pass: validateUUIDv4.required(), org: objectIdValidator.required(), id: objectIdValidator.required() });
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
