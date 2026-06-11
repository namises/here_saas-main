import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import paginate from "../../utils/paginate.js";
const filterConfig = {
  organization: { type: "objectId" },
  owner: { type: "objectId" },
  status: { type: "enum" },
};
async function handler(req, res) {
  try {
    const { employee: owner, organization } = req.user;
    const rawFilter = { organization, owner, status: "pending" };
    const attendanceRequests = await paginate({
      page: 1,
      limit: 50,
      Model: DB.AttendanceRequest,
      rawFilter,
      filterConfig,
      populate: [
        {
          path: "attendance",
          select: "checkIn checkOut status location",
          populate: {
            path: "employee",
            select: "name empCode email leaveBalances",
            populate: {
              path: "shift",
              select: "name startTime endTime isOvernight gracePeriodMins",
            },
          },
        },
      ],
      project: "checkIn checkOut reason status comments",
    });
    return handleResponse(res, { message: "Attendance requests fetched successfully", attendanceRequests });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
