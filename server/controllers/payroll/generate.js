import Joi from "joi";
import dayjs from "dayjs";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";
import DB from "../../db/index.js";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Map a financial year ("YYYY-YY", Apr–Mar) + month name to the calendar year that month falls in.
const calendarYear = (financialYear, monthIndex) => {
  const startYear = parseInt(`${financialYear}`.split("-")[0], 10);
  return monthIndex >= 3 ? startYear : startYear + 1; // Jan–Mar belong to the FY's second year
};

const dayKey = (d) => `${d.year()}-${d.month()}-${d.date()}`;

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { employee, month, financialYear } = req.body;

    const monthIndex = MONTHS.indexOf(month);
    if (monthIndex < 0) throw new Error("Invalid month");

    const empDoc = await DB.Employee.findOne({ _id: employee, organization }).select("name empCode").lean();
    if (!empDoc) throw new Error("Employee not found");

    const year = calendarYear(financialYear, monthIndex);
    const monthStart = dayjs(new Date(year, monthIndex, 1)).startOf("month");
    const monthEnd = monthStart.endOf("month");
    const totalDaysInMonth = monthEnd.date();
    const startUnix = monthStart.unix();
    const endUnix = monthEnd.unix();
    const nowUnix = dayjs().unix();

    // Latest CTC effective on/before the month end.
    const ctc = await DB.CTC.findOne({ employee, organization, effectiveFrom: { $lte: endUnix } }).sort({ effectiveFrom: -1 }).lean();
    if (!ctc) throw new Error("No salary structure (CTC) found for this employee. Add a CTC first.");

    // Org working-day pattern (Sun..Sat booleans).
    const workdaysDoc = await DB.Workdays.findOne({ organization }).lean();
    const workPattern = workdaysDoc?.workDays?.length === 7 ? workdaysDoc.workDays : [false, true, true, true, true, true, false];

    // Holidays in the month → set of day keys.
    const holidays = await DB.Holiday.find({ organization, date: { $gte: startUnix, $lte: endUnix } }).lean();
    const holidaySet = new Set(holidays.map((h) => dayKey(dayjs.unix(h.date))));

    // Attendance in the month → day key -> status.
    const attendance = await DB.Attendance.find({ employee, organization, date: { $gte: startUnix, $lte: endUnix } }).select("date status").lean();
    const statusByDay = {};
    attendance.forEach((a) => { statusByDay[dayKey(dayjs.unix(a.date))] = a.status; });

    let presentDays = 0, absentDays = 0, halfDays = 0, leaveDays = 0, holidayDays = 0, weekOffDays = 0, totalWorkingDays = 0;

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const day = monthStart.date(d);
      // Only count days that have already occurred (so current-month runs are month-to-date).
      if (day.startOf("day").unix() > nowUnix) break;
      const key = dayKey(day);
      const dow = day.day(); // 0=Sun

      if (!workPattern[dow]) { weekOffDays++; continue; }
      if (holidaySet.has(key)) { holidayDays++; continue; }

      totalWorkingDays++; // an expected working day
      const status = statusByDay[key];
      if (status === "present") presentDays++;
      else if (status === "half-day") halfDays++;
      else if (status === "leave") leaveDays++;
      else absentDays++; // explicit "absent" or no record on a working day
    }

    const payableDays = presentDays + halfDays * 0.5 + leaveDays + holidayDays + weekOffDays;
    const proration = totalDaysInMonth > 0 ? payableDays / totalDaysInMonth : 0;

    const round = (n) => parseFloat(Number(n).toFixed(2));
    // Earnings are prorated by payable days; deductions apply in full.
    const earnings = (ctc.earnings || []).map((c) => ({ name: c.name, amount: round((c.annualAmount / 12) * proration), inHandComponent: c.inHandComponent, type: "earnings" }));
    const deductions = (ctc.deductions || []).map((c) => ({ name: c.name, amount: round(c.annualAmount / 12), inHandComponent: c.inHandComponent, type: "deductions" }));

    const grossSalary = round(earnings.reduce((s, c) => s + c.amount, 0));
    const totalDeductions = round(deductions.reduce((s, c) => s + c.amount, 0));
    const netSalary = round(grossSalary - totalDeductions);

    const payrollData = {
      organization,
      employee,
      month,
      financialYear,
      status: "pending",
      totalDaysInMonth,
      totalWorkingDays,
      presentDays,
      absentDays,
      halfDays,
      leaveDays,
      holidayDays,
      weekOffDays,
      payableDays: round(payableDays),
      grossSalary,
      totalDeductions,
      netSalary,
      components: [...earnings, ...deductions],
    };

    // Re-runnable: replace any existing payroll for this employee + month + FY.
    const payroll = await DB.Payroll.findOneAndUpdate({ organization, employee, month, financialYear }, { $set: payrollData }, { new: true, upsert: true });

    return handleResponse(res, { message: `Payroll generated for ${empDoc.name} — ${month} ${financialYear}`, payroll });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}

const schema = Joi.object({
  employee: objectIdValidator.required(),
  month: Joi.string().valid(...MONTHS).required(),
  financialYear: Joi.string().required(),
});

const validation = { schema, toValidate: toValidateOptions.body };

export default { handler, validation };
