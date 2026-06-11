import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { leaveType, code, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable } = req.body;
    const org = await DB.Organization.findByIdAndUpdate(organization, { $push: { leavePolicy: { leaveType, code, maxPerYear, accrualFrequency, carryForward, encashable, maxCarryForward, maxEncashable, applicableAfterMonths } } }, { new: true });
    if (!org) throw new Error("Organization not found");
    return handleResponse(res, { message: "Leave policy created successfully", leavePolicy: org.leavePolicy[org.leavePolicy.length - 1] });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

const schema = Joi.object().keys({
  leaveType: Joi.string().min(2).max(64).required(),
  code: Joi.string().min(2).max(16).required(),
  description: Joi.string().max(256).optional(),
  maxPerYear: Joi.number().min(1).required(),
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
