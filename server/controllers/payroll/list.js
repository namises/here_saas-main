import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { objectIdValidator, validateFinancialYear } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";
import paginate from "../../utils/paginate.js";

const filterConfig = {
  employee: { type: "objectId" },
  organization: { type: "objectId" },
  month: { type: "string", mode: "exact" },
  status: { type: "string", mode: "exact" },
  financialYear: { type: "string", mode: "exact" },
};

async function handler(req, res) {
  try {
    const { employee: employeeId, matchedPermissions, organization } = req.user;
    const { page, limit, employee, month, status, financialYear } = req.queryParams;
    const canReadAll = matchedPermissions.includes(permissions.payroll.read);
    const canReadOwn = matchedPermissions.includes(permissions.payroll.readOwn);
    if (!canReadAll && !canReadOwn) throw new Error(errorStrings.notPermitted);
    const rawFilter = { organization, financialYear };
    if (canReadOwn && !canReadAll && (!employee || employee !== employeeId)) {
      employee = employeeId;
    }
    // Apply organization filter: user scope or requested org if allowed
    if (month) rawFilter.month = month;
    if (status) rawFilter.status = status;

    const payrolls = await paginate({
      page,
      limit,
      Model: DB.Payroll,
      rawFilter,
      filterConfig,
      populate: [
        { path: "employee", select: "name designation empCode" },
        { path: "organization", select: "name" },
      ],
      project: null,
      sort: { createdAt: -1 },
    });

    return handleResponse(res, {
      message: "Payrolls fetched successfully",
      payrolls,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  employee: objectIdValidator.optional(),
  month: Joi.string().valid("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December").optional(),
  status: Joi.string().valid("pending", "processed").optional(),
  financialYear: validateFinancialYear,
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
