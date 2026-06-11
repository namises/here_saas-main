import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { getFinancialYearFromUnix, objectIdValidator, validateFinancialYear } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";
import paginate from "../../utils/paginate.js";

const filterConfig = {
  financialYear: { type: "string", mode: "exact" },
  employee: { type: "objectId" },
  organization: { type: "objectId" },
};

async function handler(req, res) {
  try {
    const { employee: selfEmployeeId, matchedPermissions, organization } = req.user;
    const locale = req.headers["x-locale"];
    const org = await DB.Organization.findById(organization);
    const createdAt = new Date(org.createdAt);
    const utcTimestamp = Math.floor(createdAt.getTime() / 1000);
    const financialYears = getFinancialYearFromUnix(utcTimestamp, locale);
    const current = financialYears[financialYears.length - 1];
    const { page, limit, financialYear = current, employee } = req.queryParams;

    const canReadAll = matchedPermissions.includes(permissions.ctc.read);
    const canReadOwn = matchedPermissions.includes(permissions.ctc.readOwn);
    if (!canReadAll && !canReadOwn) {
      throw new Error(errorStrings.notPermitted);
    }
    const rawFilter = { financialYear, organization };
    if (canReadAll) {
      if (employee) rawFilter.employee = employee;
      const result = await paginate({
        page,
        limit,
        Model: DB.CTC,
        rawFilter,
        filterConfig,
        populate: [
          {
            path: "employee",
            select: "name designation department",
            populate: { path: "department", select: "name code" },
          },
        ],
        project: "employee financialYear earnings deductions totalCTC effectiveFrom",
      });

      return handleResponse(res, {
        message: "CTCs fetched successfully",
        data: result,
      });
    }

    if (canReadOwn) {
      const empDoc = await DB.Employee.findOne({ _id: selfEmployeeId, organization });
      if (!empDoc) throw new Error("Employee not found");
      const ctc = await paginate({
        page,
        limit,
        Model: DB.CTC,
        rawFilter: { employee: selfEmployeeId, ...rawFilter },
        filterConfig,
        populate: [
          {
            path: "employee",
            select: "name designation department",
            populate: { path: "department", select: "name code" },
          },
        ],
        project: "employee financialYear earnings deductions totalCTC effectiveFrom",
      });

      return handleResponse(res, {
        message: "CTCs fetched successfully",
        ctc,
      });
    }

    throw new Error(errorStrings.notPermitted);
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  financialYear: validateFinancialYear,
  employee: objectIdValidator.optional(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
