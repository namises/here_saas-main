import Joi from "joi";
import dayjs from "dayjs";
import { createObjectCsvStringifier } from "csv-writer";
import { handleError } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import { timestampValidator, objectIdValidator } from "../../utils/index.js";
import { buildFilters } from "../../utils/paginate.js";

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
    let { employee, startDate, endDate, status, requested } = req.queryParams;
    const canReadAll = matchedPermissions.includes(permissions.attendance.read);
    const canReadOwn = matchedPermissions.includes(permissions.attendance.readOwn);
    if (canReadOwn && !canReadAll && (!employee || employee !== employeeId)) {
      employee = employeeId;
    }
    const rawFilter = { organization, employee, date: { min: startDate, max: endDate }, status, requested };
    const filter = buildFilters(rawFilter, filterConfig);
    let attendanceRecords = await DB.Attendance.find(filter).select("date checkIn checkOut status location checkOutLocation selfie punchType requested comments").populate({ path: "employee", select: "name empCode" });
    const data = attendanceRecords.map((dm) => {
      const d = dm.toObject();
      return {
        Name: d.employee.name,
        "Employee Code": d.employee.empCode,
        Date: dayjs.unix(d.date).format("DD MMM YYYY"),
        "In Time": d.checkIn ? dayjs.unix(d.checkIn).format("HH:mm") : "",
        "Out Time": d.checkOut ? dayjs.unix(d.checkOut).format("HH:mm") : "",
        Status: d.status,
        "Punch Type": d.punchType || "qr",
        "Check-In Latitude": d.location?.lat ?? "",
        "Check-In Longitude": d.location?.lng ?? "",
        "Check-Out Latitude": d.checkOutLocation?.lat ?? "",
        "Check-Out Longitude": d.checkOutLocation?.lng ?? "",
        "Check-In Selfie": d.selfie?.checkIn ?? "",
        "Check-Out Selfie": d.selfie?.checkOut ?? "",
        Requested: d.requested ? "Yes" : "No",
        Comments: d.comments,
      };
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "Name", title: "Name" },
        { id: "Employee Code", title: "Employee Code" },
        { id: "Date", title: "Date" },
        { id: "In Time", title: "In Time" },
        { id: "Out Time", title: "Out Time" },
        { id: "Status", title: "Status" },
        { id: "Punch Type", title: "Punch Type" },
        { id: "Check-In Latitude", title: "Check-In Latitude" },
        { id: "Check-In Longitude", title: "Check-In Longitude" },
        { id: "Check-Out Latitude", title: "Check-Out Latitude" },
        { id: "Check-Out Longitude", title: "Check-Out Longitude" },
        { id: "Check-In Selfie", title: "Check-In Selfie URL" },
        { id: "Check-Out Selfie", title: "Check-Out Selfie URL" },
        { id: "Requested", title: "Requested" },
        { id: "Comments", title: "Comments" },
      ],
    });
    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="attendance_report_${new Date()}.csv"`);
    res.status(200).send(csv);
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
});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
