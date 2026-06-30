import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { timestampValidator, objectIdValidator, FILE_URL_REGEX, PAN_REGEX } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";

// Fields a logged-in employee may change on their OWN profile. Anything sensitive
// (permissions, status, empCode, department, manager, attendancePunchType, comp, work-info)
// is admin-only and silently dropped from self-edits.
const SELF_EDITABLE_FIELDS = ["name", "mobile", "photo", "dob", "gender", "bloodGroup", "maritalStatus", "personalEmail", "alternateMobile", "address", "bankAccount", "ifsc"];

async function handler(req, res) {
  try {
    const { matchedPermissions, organization } = req.user;
    const { employeeId, ...updatePayload } = req.body;

    const employee = await DB.Employee.findById(employeeId);
    if (!employee) throw new Error("Employee not found");

    const isOwn = employeeId === employee._id.toString();
    const isAdminEdit = matchedPermissions.includes(permissions.employee.update);
    const canEdit = isAdminEdit || (matchedPermissions.includes(permissions.employee.updateOwn) && isOwn);
    if (!canEdit) throw new Error(errorStrings.notPermitted);

    let payload = updatePayload;
    if (!isAdminEdit) {
      // Self-service edit: whitelist personal fields only.
      payload = {};
      for (const f of SELF_EDITABLE_FIELDS) if (f in updatePayload) payload[f] = updatePayload[f];
      // Employees may ADD documents but never edit/delete existing ones → preserve all existing, append new.
      if (Array.isArray(updatePayload.documents)) {
        const existing = (employee.documents || []).map((d) => (d.toObject ? d.toObject() : d));
        const existingIds = new Set(existing.map((d) => String(d._id)));
        const appended = updatePayload.documents
          .filter((d) => !d._id || !existingIds.has(String(d._id)))
          .map((d) => ({ name: d.name, url: d.url, type: d.type, category: d.category, uploadedBy: employee._id, uploadedByRole: "employee" }));
        payload.documents = [...existing, ...appended];
      }
      // Employees may SUBMIT or WITHDRAW their OWN resignation, but can't approve it or change their status.
      if (updatePayload.resignation) {
        const r = updatePayload.resignation;
        payload.resignation = {
          resignedOn: r.resignedOn ?? Math.floor(Date.now() / 1000),
          lastWorkingDay: r.lastWorkingDay ?? null,
          reason: r.reason ?? null,
          noticePeriodDays: r.noticePeriodDays ?? null,
          status: r.status === "withdrawn" ? "withdrawn" : "submitted",
        };
      }
    }

    const updatedEmployee = await DB.Employee.findByIdAndUpdate(employeeId, payload, { new: true });

    // Only admins can reassign a manager (self-edits can't reach this — manager is filtered out above).
    const manager = isAdminEdit ? updatePayload.manager : undefined;
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

const documentItem = Joi.object({
  _id: Joi.any(),
  name: Joi.string().required(),
  url: Joi.string().uri().required(),
  type: Joi.string().required(),
  category: Joi.string().allow(null, ""),
  uploadedBy: Joi.any(),
  uploadedByRole: Joi.string().valid("admin", "employee"),
  createdAt: Joi.number(),
}).unknown(true);

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
  documents: Joi.array().items(documentItem).optional(),
  pan: Joi.string().uppercase().trim().length(10).pattern(PAN_REGEX).messages({
    "string.pattern.base": "PAN must be in the format AAAAA9999A",
    "string.length": "PAN must be exactly 10 characters",
  }),
  photo: Joi.string().pattern(FILE_URL_REGEX).messages({
    "string.pattern.base": "Photo Must be a valid URL",
  }),
  bankAccount: Joi.string(),
  ifsc: Joi.string(),
  attendancePunchType: Joi.string().valid("qr", "selfie").allow(null),
  permissions: Joi.array().items(Joi.string()),

  // ---- Expanded profile ----
  gender: Joi.string().valid("male", "female", "other").allow(null),
  bloodGroup: Joi.string().allow(null, ""),
  maritalStatus: Joi.string().valid("single", "married", "divorced", "widowed").allow(null),
  personalEmail: Joi.string().email().allow(null, ""),
  alternateMobile: Joi.string().allow(null, ""),
  address: Joi.string().allow(null, ""),
  dateOfJoining: timestampValidator.optional(),
  probationPeriodMonths: Joi.number().allow(null),
  probationStatus: Joi.string().valid("on-probation", "confirmed", "extended").allow(null),
  employeeType: Joi.string().valid("full-time", "part-time", "contract", "intern").allow(null),
  workLocation: Joi.string().allow(null, ""),
  workExperienceYears: Joi.number().allow(null),
  billingStatus: Joi.string().valid("billable", "non-billable").allow(null),
  jobTitle: Joi.string().allow(null, ""),
  subDepartment: Joi.string().allow(null, ""),
  workHistory: Joi.array().items(
    Joi.object({
      _id: Joi.any(),
      department: Joi.string().allow(null, ""),
      designation: Joi.string().allow(null, ""),
      from: Joi.number().allow(null),
      to: Joi.number().allow(null),
      organization: Joi.string().allow(null, ""),
    })
  ),
  resignation: Joi.object({
    resignedOn: Joi.number().allow(null),
    lastWorkingDay: Joi.number().allow(null),
    reason: Joi.string().allow(null, ""),
    noticePeriodDays: Joi.number().allow(null),
    status: Joi.string().valid("none", "submitted", "approved", "withdrawn", "completed"),
  }),
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
