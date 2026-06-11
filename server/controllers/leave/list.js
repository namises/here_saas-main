import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import paginate from "../../utils/paginate.js";
import { objectIdValidator } from "../../utils/index.js";
import permissions from "../../utils/permissions.js";

const filterConfig = {
  organization: { type: "objectId" },
  employee: { type: "objectId" },
  owner: { type: "objectId" },
  status: { type: "enum" },
  leaveType: { type: "enum" },
};

async function handler(req, res) {
  try {
    const { organization, employee: selfEmployeeId, matchedPermissions, manager } = req.user;
    let { employee: employeeId, status, leaveType, page, limit } = req.queryParams;
    const canReadAll = matchedPermissions.includes(permissions.leave.read);
    const canReadOwn = matchedPermissions.includes(permissions.leave.readOwn);
    let owner = null;
    if (canReadOwn && !canReadAll && (!employeeId || employeeId !== selfEmployeeId)) {
      employeeId = selfEmployeeId;
    } else {
      owner = employeeId;
    }

    const rawFilter = { organization, employee: employeeId, owner, status, leaveType };
    const leaves = await paginate({ page, limit, Model: DB.LeaveRequest, rawFilter, filterConfig, populate: [{ path: "employee", select: "name designation" }], project: "fromDate toDate leaveType days status reason owner" });
    return handleResponse(res, { message: "Leaves fetched successfully", leaves });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

// Validation Schema
const schema = Joi.object({
  employee: objectIdValidator.optional(),
  status: Joi.string().valid("pending", "approved", "rejected").optional(),
  leaveType: Joi.string().optional(),
  limit: Joi.number().min(1).max(100).default(10).optional(),
  page: Joi.number().min(1).default(1).optional(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
