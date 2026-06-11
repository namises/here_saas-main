import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { timestampValidator, objectIdValidator, FILE_URL_REGEX, PAN_REGEX } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { matchedPermissions } = req.user;
    const { employeeId, ...updatePayload } = req.body;

    const employee = await DB.Employee.findById(employeeId);
    if (!employee) throw new Error("Employee not found");

    const isOwn = employeeId === employee._id.toString();

    const canEdit = matchedPermissions.includes(permissions.employee.update) || (matchedPermissions.includes(permissions.employee.updateOwn) && isOwn);

    if (!canEdit) throw new Error(errorStrings.notPermitted);

    const updatedEmployee = await DB.Employee.findByIdAndUpdate(employeeId, updatePayload, { new: true });
    const manager = updatePayload.manager;
    if (manager) {
      const managerDoc = await DB.Hierarchy.findOne({ organization, employee: manager });
      if (!managerDoc) throw new Error("Manager not found");
      await DB.Hierarchy.findOneAndUpdate({ organization, employee: employeeId }, { reportsTo: manager, level: managerDoc.level + 1 });
    }
    return handleResponse(res, {
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  employeeId: objectIdValidator.required(),
  organization: objectIdValidator.optional(),
  name: Joi.string().max(128).optional(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  dob: timestampValidator.optional(),
  joiningDate: timestampValidator.optional(),
  designation: Joi.string().max(128).optional(),
  empCode: Joi.string().optional(),
  department: objectIdValidator.optional(),
  manager: objectIdValidator.optional(),
  status: Joi.string().valid("active", "inactive", "resigned", "terminated").optional(),
  documents: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        url: Joi.string().uri().required(),
        type: Joi.string().required(),
      })
    )
    .optional(),
  pan: Joi.string().uppercase().trim().length(10).pattern(PAN_REGEX).messages({
    "string.pattern.base": "PAN must be in the format AAAAA9999A",
    "string.length": "PAN must be exactly 10 characters",
  }),
  photo: Joi.string().pattern(FILE_URL_REGEX).messages({
    "string.pattern.base": "Photo Must be a valid URL",
  }),
  bankAccount: Joi.string(),
  ifsc: Joi.string(),
  permissions: Joi.array().items(Joi.string()),
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
