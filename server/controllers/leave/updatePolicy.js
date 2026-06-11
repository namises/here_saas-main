import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { leavePolicyId, ...updates } = req.body;
    const org = await DB.Organization.findOneAndUpdate(
      { _id: organization, "leavePolicy._id": leavePolicyId },
      {
        $set: Object.entries(updates).reduce((acc, [key, value]) => {
          acc[`leavePolicy.$.${key}`] = value;
          return acc;
        }, {}),
      },
      { new: true }
    );
    if (!org) throw new Error("Leave policy not found");
    const leavePolicy = org.leavePolicy.find((lp) => lp._id.toString() === leavePolicyId);
    return handleResponse(res, { message: "Leave policy updated successfully", leavePolicy });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

const schema = Joi.object().keys({
  leavePolicyId: objectIdValidator.required(),
  leaveType: Joi.string().min(2).max(64).required(),
  code: Joi.string().alphanum().min(2).max(16).required(),
  description: Joi.string().max(256).optional(),
  maxPerYear: Joi.number().min(0).required(),
  accrualFrequency: Joi.string().valid("monthly", "quarterly", "annually").required(),
  applicableAfterMonths: Joi.number().min(0).default(0),
  carryForward: Joi.boolean().default(false),
  maxCarryForward: Joi.number().min(0).when("carryForward", { is: true, then: Joi.required() }),
  encashable: Joi.boolean().default(false),
  maxEncashable: Joi.number().min(0).when("encashable", { is: true, then: Joi.required() }),
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
