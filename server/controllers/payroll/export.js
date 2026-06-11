import Joi from "joi";
import { handleError } from "../../utils/handlers.js";
import { errorStrings } from "../../utils/constants.js";
import { objectIdValidator, validateFinancialYear } from "../../utils/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import permissions from "../../utils/permissions.js";
import DB from "../../db/index.js";
import { buildFilters } from "../../utils/paginate.js";
import { createObjectCsvStringifier } from "csv-writer";

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
    const { employee, month, status, financialYear } = req.queryParams;
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
    const filter = buildFilters(rawFilter, filterConfig);
    let payrollRecords = await DB.Payroll.find(filter).select("month status totalWorkingDays presentDays grossSalary netSalary financialYear").populate({ path: "employee", select: "name empCode" });
    const data = payrollRecords.map((dm) => {
      const d = dm.toObject();
      return {
        Name: d.employee.name,
        "Employee Code": d.employee.empCode,
        Month: d.month,
        Status: d.status,
        "Total Working Days": d.totalWorkingDays,
        "Present Days": d.presentDays,
        "Gross Salary": d.grossSalary,
        "Net Salary": d.netSalary,
        Deductions: (d.grossSalary - d.netSalary).toFixed(2),
        "Financial Year": d.financialYear,
      };
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "Name", title: "Name" },
        { id: "Employee Code", title: "Employee Code" },
        { id: "Month", title: "Month" },
        { id: "Status", title: "Status" },
        { id: "Total Working Days", title: "Total Working Days" },
        { id: "Present Days", title: "Present Days" },
        { id: "Gross Salary", title: "Gross Salary" },
        { id: "Net Salary", title: "Net Salary" },
        { id: "Deductions", title: "Deductions" },
        { id: "Financial Year", title: "Financial Year" },
      ],
    });
    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="payroll_report_${new Date()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
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
