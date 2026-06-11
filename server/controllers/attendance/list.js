import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import { timestampValidator, objectIdValidator } from "../../utils/index.js";
import paginate from "../../utils/paginate.js";
const filterConfig = {
  organization: { type: "objectId" },
  employee: { type: "objectId" },
  date: { type: "number" },
  status: { type: "enum" },
  requested: { type: "boolean" },
};
async function handler(req, res) {
  try {
    const { employee: employeeId, matchedPermissions, organization } = req.user;
    let { employee, startDate, endDate, status, requested, limit = 50, page = 1 } = req.queryParams;
    const canReadAll = matchedPermissions.includes(permissions.attendance.read);
    const canReadOwn = matchedPermissions.includes(permissions.attendance.readOwn);
    if (canReadOwn && !canReadAll && (!employee || employee !== employeeId)) {
      employee = employeeId;
    }
    const rawFilter = { organization, employee, date: { min: startDate, max: endDate }, status, requested };
    const attendance = await paginate({
      page,
      limit,
      Model: DB.Attendance,
      rawFilter,
      filterConfig,
      populate: [
        {
          path: "attendanceRequest",
          select: "owner status reason createdAt", // Optional: customize fields
        },
        { path: "employee", select: "name empCode" },
      ],
      project: "date checkIn checkOut status location checkOutLocation selfie punchType requested comments",
    });
    return handleResponse(res, { message: "Attendance fetched successfully", attendance });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  employee: objectIdValidator.optional(),
  startDate: timestampValidator.optional(),
  endDate: timestampValidator.optional(),
  status: Joi.string().valid("present", "half-day", "absent", "leave", "holiday", "week_off").optional(),
  requested: Joi.boolean().optional(),
  limit: Joi.number().optional().default(50),
  page: Joi.number().optional().default(1),
});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
