import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { search, accrualFrequency, carryForward, encashable } = req.queryParams;
    const org = await DB.Organization.findById(organization);
    if (!org) throw new Error("Organization not found");
    let leavePolicies = org.leavePolicy;
    if (search) {
      const pattern = new RegExp(search, "i");
      leavePolicies = leavePolicies.filter((p) => pattern.test(p.leaveType) || pattern.test(p.code));
    }
    if (accrualFrequency) leavePolicies = leavePolicies.filter((p) => p.accrualFrequency === accrualFrequency);
    if (carryForward !== undefined) leavePolicies = leavePolicies.filter((p) => p.carryForward === true);
    if (encashable !== undefined) leavePolicies = leavePolicies.filter((p) => p.encashable === true);
    return handleResponse(res, {
      message: "Leave policies fetched successfully",
      leavePolicies,
    });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

// Validation Schema
const schema = Joi.object({
  search: Joi.string().optional(),
  accrualFrequency: Joi.string().valid("monthly", "quarterly", "annually").optional(),
  carryForward: Joi.boolean().truthy("true").falsy("false").optional(),
  encashable: Joi.boolean().truthy("true").falsy("false").optional(),
  limit: Joi.number().min(1).max(100).optional(),
  page: Joi.number().min(1).optional(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
