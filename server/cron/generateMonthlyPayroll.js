import dayjs from "dayjs";
import pMap from "p-map";
import DB from "../db/index.js";

export default async function generateMonthlyPayroll() {
  console.log("Cron Start: generateMonthlyPayroll");

  const today = dayjs();
  const targetMonth = today.month(); // 0-indexed
  const year = today.year();
  const monthName = today.format("MMMM");

  const financialYear = targetMonth >= 3 ? `${year}-${(year + 1).toString().slice(-2)}` : `${year - 1}-${year.toString().slice(-2)}`;

  const startOfMonth = dayjs(`${year}-${targetMonth + 1}-01`)
    .startOf("month")
    .unix();
  const endOfMonth = dayjs(`${year}-${targetMonth + 1}-01`)
    .endOf("month")
    .unix();

  try {
    const employees = await DB.Employee.find({ status: "active" }, "_id name organization").lean();

    await pMap(
      employees,
      (employee) =>
        processPayrollForEmployee(employee, {
          financialYear,
          monthName,
          startOfMonth,
          endOfMonth,
        }),
      { concurrency: 3 }
    );

    console.log("Payroll generation completed for", today.format("YYYY-MM-DD"));
  } catch (err) {
    console.error("Error in generateMonthlyPayroll", err);
  }
}

async function processPayrollForEmployee(employee, context) {
  const { financialYear, monthName, startOfMonth, endOfMonth } = context;

  const ctc = await DB.CTC.findOne({
    employee: employee._id,
    organization: employee.organization,
    effectiveFrom: { $lte: endOfMonth },
  })
    .sort({ effectiveFrom: -1 })
    .lean();

  if (!ctc) return;

  const totalWorkingDays = dayjs.unix(endOfMonth).date();

  const attendanceRecords = await DB.Attendance.find({
    employee: employee._id,
    organization: employee.organization,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).lean();

  const presentDays = attendanceRecords.filter((a) => a.status === "present").length;

  const computeComponent = (component) => {
    const monthly = component.annualAmount / 12;
    const prorated = (monthly / totalWorkingDays) * presentDays;
    return {
      name: component.name,
      amount: parseFloat(prorated.toFixed(2)),
      inHandComponent: component.inHandComponent,
      type: component.type,
    };
  };

  const earnings = ctc.earnings.map(computeComponent);
  const deductions = ctc.deductions.map(computeComponent);

  const totalEarnings = earnings.reduce((sum, comp) => sum + comp.amount, 0);
  const totalDeductions = deductions.reduce((sum, comp) => sum + comp.amount, 0);

  const grossSalary = parseFloat(totalEarnings.toFixed(2));
  const netSalary = parseFloat((grossSalary - totalDeductions).toFixed(2));

  const exists = await DB.Payroll.findOne({
    employee: employee._id,
    month: monthName,
    createdAt: {
      $gte: dayjs.unix(startOfMonth).toDate(),
      $lte: dayjs.unix(endOfMonth).toDate(),
    },
  }).lean();

  if (exists) return;

  await DB.Payroll.create({
    organization: employee.organization,
    employee: employee._id,
    month: monthName,
    status: "pending",
    totalWorkingDays,
    presentDays,
    financialYear,
    grossSalary,
    netSalary,
    components: [...earnings, ...deductions],
  });
}
