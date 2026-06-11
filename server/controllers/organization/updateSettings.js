import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { attendancePunchType } = req.body;

    const orgDoc = await DB.Organization.findById(organization);
    if (!orgDoc) throw new Error("Organization not found");

    if (attendancePunchType !== undefined) orgDoc.attendancePunchType = attendancePunchType;
    await orgDoc.save();

    return handleResponse(res, { message: "Settings updated successfully", attendancePunchType: orgDoc.attendancePunchType });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

const schema = Joi.object().keys({
  attendancePunchType: Joi.string().valid("qr", "selfie", "both").required(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
