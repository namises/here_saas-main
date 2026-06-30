// server/seed.js
// Minimal demo seed.
//   - WIPES the entire database first.
//   - Creates 2 organizations ("branches").
//   - Each org has 2 admins (a super-admin owner + an org admin).
//   - Each admin has 2 employees reporting to them (4 employees per org).
//   - Plus the essentials so features have data: department, shift, workdays, leave balances,
//     CTC (for payroll), attendance, holidays.
//
//   Run:  yarn seed   (or)   node server/seed.js
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { authenticator } from "otplib";
import DB from "./db/index.js";
import permissionsPresets from "./utils/permissionsPresets.js";

const PASSWORD = "password123";

const DAY = 86400;
const nowSec = Math.floor(Date.now() / 1000);
const days = (n) => nowSec + n * DAY;
const startOfDay = (ts) => {
  const d = new Date(ts * 1000);
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// April–March financial year for the current month.
const _y = new Date().getFullYear();
const _m = new Date().getMonth();
const FINANCIAL_YEAR = _m >= 3 ? `${_y}-${String(_y + 1).slice(-2)}` : `${_y - 1}-${String(_y).slice(-2)}`;

const LEAVE_POLICY = [
  { leaveType: "Annual Leave", code: "AL", maxPerYear: 30, accrualFrequency: "monthly", carryForward: true, maxCarryForward: 10, encashable: true, maxEncashable: 10 },
  { leaveType: "Sick Leave", code: "SL", maxPerYear: 15, accrualFrequency: "monthly" },
  { leaveType: "Casual Leave", code: "CL", maxPerYear: 10, accrualFrequency: "monthly" },
];
const leaveBalances = () => LEAVE_POLICY.map((p) => ({ leaveType: p.leaveType, code: p.code, credited: p.maxPerYear, used: 0, carryForwarded: 0 }));

// Standard CTC components for an annual salary.
const ctcFor = (employeeId, organization, annual) => {
  const basic = Math.round(annual * 0.6);
  const housing = Math.round(annual * 0.25);
  const transport = annual - basic - housing;
  const insurance = Math.round(annual * 0.05);
  return {
    organization,
    employee: employeeId,
    financialYear: FINANCIAL_YEAR,
    totalCTC: annual,
    earnings: [
      { name: "Basic", annualAmount: basic, type: "earnings", inHandComponent: true },
      { name: "Housing Allowance", annualAmount: housing, type: "earnings", inHandComponent: true },
      { name: "Transport Allowance", annualAmount: transport, type: "earnings", inHandComponent: true },
    ],
    deductions: [{ name: "Insurance", annualAmount: insurance, type: "deductions", inHandComponent: true }],
  };
};

const COMPANIES = [
  { name: "Acme Corp", domain: "acme.ae", email: "hr@acme.ae", mobile: "0500000001", pan: "ACMEC1234A", address: "Sheikh Zayed Road, Dubai, UAE", empPrefix: "AC", emirate: "Dubai", city: "Business Bay" },
  { name: "Globex LLC", domain: "globex.ae", email: "hr@globex.ae", mobile: "0500000002", pan: "GLOBX5678G", address: "Al Maryah Island, Abu Dhabi, UAE", empPrefix: "GX", emirate: "Abu Dhabi", city: "Al Maryah" },
];

// Hand out globally-unique mobile numbers (Employee.mobile has a unique index).
let mobileSeq = 0;
const nextMobile = () => `05${50000000 + mobileSeq++}`;

async function wipeDatabase() {
  const names = Object.keys(DB).filter((k) => typeof DB[k]?.deleteMany === "function");
  await Promise.all(names.map((k) => DB[k].deleteMany({})));
  console.log(`🧹 Wiped ${names.length} collections`);
}

async function seedOrganization(company, hashedPassword) {
  // --- Org ---
  const org = await DB.Organization.create({
    name: company.name,
    domain: company.domain,
    email: company.email,
    mobile: company.mobile,
    pan: company.pan,
    address: company.address,
    attendancePunchType: "both",
    leavePolicy: LEAVE_POLICY,
  });
  const organization = org._id;
  console.log("🏢", org.name);

  // --- Branch (HQ) ---
  await DB.Branch.create({ organization, name: `${company.name} HQ`, code: `${company.empPrefix}-HQ`, emirate: company.emirate, city: company.city, isHeadOffice: true, status: "active", phone: "04-1234567" });

  // --- Departments, Shift, Workdays, Device ---
  const [engDept, salesDept] = await DB.Department.insertMany([
    { organization, name: "Engineering", code: "ENG", description: "Engineering department" },
    { organization, name: "Sales", code: "SAL", description: "Sales department" },
  ]);
  const shift = await DB.Shift.create({ organization, name: "General Shift", startTime: "09:00", endTime: "18:00", isOvernight: false, gracePeriodMins: 15, minHalfDayDuration: 240, minFullDayDuration: 480 });
  await DB.Workdays.create({ organization, workDays: [false, true, true, true, true, true, false] });
  await DB.AttendanceCode.create({ organization, deviceId: uuid(), secret: authenticator.generateSecret(), loginPassword: uuid() });

  // --- People: 2 admins, each with 2 employees ---
  const baseEmployee = (over) => ({
    organization,
    shift: shift._id,
    hashedPassword,
    isActive: true,
    status: "active",
    dob: days(-randInt(8000, 14000)),
    joiningDate: days(-randInt(200, 1500)),
    mobile: nextMobile(),
    leaveBalances: leaveBalances(),
    bankAccount: `AE${randInt(1000000000, 9999999999)}`,
    ...over,
  });

  // Admin 1 = super-admin owner (Engineering). Admin 2 = org admin (Sales).
  const admin1 = await DB.Employee.create(baseEmployee({ name: `${company.name} Owner`, email: `superadmin@${company.domain}`, designation: "Managing Director", empCode: `${company.empPrefix}-1001`, department: engDept._id, isSuperAdmin: true, permissions: [...permissionsPresets.organizationAdmin] }));
  const admin2 = await DB.Employee.create(baseEmployee({ name: `${company.name} Admin`, email: `admin@${company.domain}`, designation: "HR Manager", empCode: `${company.empPrefix}-1002`, department: salesDept._id, manager: admin1._id, permissions: [...permissionsPresets.organizationAdmin] }));

  // 2 employees under each admin.
  const mkEmp = (n, admin, dept) => baseEmployee({ name: `${company.empPrefix} Employee ${n}`, email: `emp${n}@${company.domain}`, designation: "Associate", empCode: `${company.empPrefix}-200${n}`, department: dept, manager: admin._id, permissions: [...permissionsPresets.employee] });
  const emp1 = await DB.Employee.create(mkEmp(1, admin1, engDept._id));
  const emp2 = await DB.Employee.create(mkEmp(2, admin1, engDept._id));
  const emp3 = await DB.Employee.create(mkEmp(3, admin2, salesDept._id));
  const emp4 = await DB.Employee.create(mkEmp(4, admin2, salesDept._id));

  const employees = [emp1, emp2, emp3, emp4];
  const everyone = [admin1, admin2, ...employees];

  // --- Hierarchy ---
  await DB.Hierarchy.insertMany([
    { organization, employee: admin1._id, reportsTo: null, level: 1 },
    { organization, employee: admin2._id, reportsTo: admin1._id, level: 2 },
    { organization, employee: emp1._id, reportsTo: admin1._id, level: 3 },
    { organization, employee: emp2._id, reportsTo: admin1._id, level: 3 },
    { organization, employee: emp3._id, reportsTo: admin2._id, level: 3 },
    { organization, employee: emp4._id, reportsTo: admin2._id, level: 3 },
  ]);

  // --- CTC for everyone (so payroll can be generated) ---
  await DB.CTC.insertMany(everyone.map((e) => ctcFor(e._id, organization, randInt(96000, 300000))));

  // --- Attendance for employees (last ~12 weekdays) ---
  const attendance = [];
  for (let d = 1; d <= 12; d++) {
    const dateVal = startOfDay(days(-d));
    const dow = new Date(dateVal * 1000).getDay();
    if (dow === 0 || dow === 6) continue; // weekends
    for (const e of employees) {
      const roll = Math.random();
      const status = roll > 0.9 ? "leave" : roll > 0.82 ? "absent" : roll > 0.74 ? "half-day" : "present";
      const checkIn = status === "present" || status === "half-day" ? dateVal + 9 * 3600 + randInt(-600, 1200) : undefined;
      const checkOut = status === "present" ? dateVal + 18 * 3600 + randInt(-1200, 1800) : status === "half-day" ? dateVal + 13 * 3600 : undefined;
      attendance.push({ organization, employee: e._id, date: dateVal, status, ...(checkIn ? { checkIn } : {}), ...(checkOut ? { checkOut } : {}), punchType: "selfie" });
    }
  }
  await DB.Attendance.insertMany(attendance);

  // --- Holidays ---
  await DB.Holiday.insertMany([
    { organization, financialYear: FINANCIAL_YEAR, name: "Eid Holiday", date: days(15), remarks: "Public holiday" },
    { organization, financialYear: FINANCIAL_YEAR, name: "National Day", date: days(120), remarks: "National holiday" },
  ]);

  // --- A couple of announcements ---
  await DB.Announcement.insertMany([
    { organization, title: "Welcome to the portal", body: "This is a demo organization. Explore attendance, leaves and payroll.", category: "general", priority: "normal", pinned: true, publishedBy: admin1._id },
    { organization, title: "Payroll runs manually", body: "Admins now generate payroll per employee from the Payroll page.", category: "policy", priority: "high", publishedBy: admin2._id },
  ]);

  console.log(`   👥 2 admins + 4 employees · 🕒 ${attendance.length} attendance rows`);

  return {
    org: org.name,
    domain: company.domain,
    logins: {
      superAdmin: admin1.email,
      admin: admin2.email,
      employeesUnderSuperAdmin: [emp1.email, emp2.email],
      employeesUnderAdmin: [emp3.email, emp4.email],
    },
  };
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔌 Connected to MongoDB");

  await wipeDatabase();

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const results = [];
  for (const company of COMPANIES) results.push(await seedOrganization(company, hashedPassword));

  console.log("\n✅ Seed complete!\n");
  console.log("════════════════════════════════════════════════════════");
  console.log(`  ${results.length} organizations · 2 admins + 4 employees each`);
  console.log(`  Password for every account: ${PASSWORD}`);
  console.log("════════════════════════════════════════════════════════");
  for (const r of results) {
    console.log(`\n  🏢 ${r.org}  ·  ${r.domain}`);
    console.log("     Super Admin (owner) :", r.logins.superAdmin);
    console.log("     Admin               :", r.logins.admin);
    console.log("     Emps under owner    :", r.logins.employeesUnderSuperAdmin.join(", "));
    console.log("     Emps under admin    :", r.logins.employeesUnderAdmin.join(", "));
  }
  console.log("════════════════════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
