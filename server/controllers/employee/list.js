import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { objectIdValidator } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";
import paginate from "../../utils/paginate.js";
import { sendNotification } from "../../utils/firebase.js";

const filterConfig = {
  organization: { type: "objectId" },
  _id: { type: "objectId" },
  or: {
    keys: ["empCode", "name", "mobile", "email", "designation", "status"],
    type: "or",
    mode: "partial",
  },
  empCode: { type: "string", mode: "partial" },
  email: { type: "string", mode: "partial" },
  name: { type: "string", mode: "partial" },
  mobile: { type: "string", mode: "partial" },
  designation: { type: "string", mode: "partial" },
  department: { type: "objectId" },
  manager: { type: "objectId" },
  status: { type: "enum" },
};

async function handler(req, res) {
  try {
    const { matchedPermissions, organization, employee: selfEmployeeId } = req.user;
    const { page, limit, employeeId, empCode, name, email, mobile, department, designation, manager, status } = req.queryParams;
    const canReadAll = matchedPermissions.includes(permissions.employee.read);
    const canReadOwn = matchedPermissions.includes(permissions.employee.readOwn);

    const rawFilter = {
      _id: employeeId,
      organization,
      department,
      manager,
      or: { empCode, name, email, mobile, designation, status },
    };

    if (canReadAll) {
      const employees = await paginate({
        page,
        limit,
        Model: DB.Employee,
        rawFilter,
        filterConfig,
        populate: [
          { path: "department", select: "name code description" },
          { path: "manager", select: "name email mobile empCode designation" },
        ],
        project: "name email mobile designation status photo bankAccount ifsc pan",
      });
      return handleResponse(res, {
        message: "Employees fetched successfully",
        employees,
      });
    }

    if (canReadOwn) {
      const employee = await DB.Employee.findOne({ _id: selfEmployeeId }).populate({ path: "department", select: "name code description" }).populate({
        path: "manager",
        select: "name email mobile empCode designation",
      });

      if (!employee) throw new Error("Employee not found");

      return handleResponse(res, {
        message: "Employee fetched successfully",
        employees: {
          items: [employee],
          pagination: {
            totalResults: 1,
            previousPage: null,
            currentPage: 1,
            nextPage: null,
            lastPage: 1,
            limit: 1,
          },
        },
      });
    }
    throw new Error(errorStrings.notPermitted);
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  employeeId: objectIdValidator.optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  mobile: Joi.string().optional(),
  department: objectIdValidator.optional(),
  designation: Joi.string().max(128).optional(),
  manager: objectIdValidator.optional(),
  empCode: Joi.string().optional(),
  status: Joi.string().valid("active", "inactive", "resigned", "terminated").optional(),
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
