// server/seed.js
// Seeds a self-contained demo organization with admins, employees and data
// across every module so all dashboards/charts populate for testing.
//
//   Run:  yarn seed      (or)   node server/seed.js
//
// Re-runnable: it wipes and recreates the demo org (scoped by domain) only.
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { authenticator } from "otplib";
import DB from "./db/index.js";
import permissionsPresets from "./utils/permissionsPresets.js";

const DEMO_DOMAIN = "falcontech.ae";
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
const monthName = MONTHS[new Date().getMonth()];

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sampleMany = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const slugEmail = (name) => `${name.toLowerCase().replace(/[^a-z ]/g, "").trim().replace(/\s+/g, ".")}@${DEMO_DOMAIN}`;

const compStatus = (exp) => {
  const d = exp - nowSec;
  if (d < 0) return "expired";
  if (d < 30 * DAY) return "expiring-soon";
  return "valid";
};

async function cleanup(orgId) {
  const models = [
    "Employee", "Department", "Branch", "Shift", "Hierarchy", "Workdays", "AttendanceCode", "Attendance", "LeaveRequest", "Holiday", "CTC", "Payroll",
    "Asset", "Expense", "Announcement", "Job", "Candidate", "PerformanceReview", "Goal", "CompanyDocument", "ApprovalRequest", "ComplianceRecord", "WpsBatch", "BiometricDevice",
  ];
  await Promise.all(models.map((m) => DB[m].deleteMany({ organization: orgId })));
  await DB.Organization.deleteOne({ _id: orgId });
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔌 Connected to MongoDB");

  const existing = await DB.Organization.findOne({ domain: DEMO_DOMAIN });
  if (existing) {
    console.log("♻️  Removing previous demo org…");
    await cleanup(existing._id);
  }

  // ----------------------------------------------------------------- Org
  const org = await DB.Organization.create({
    name: "Falcon Technologies LLC",
    domain: DEMO_DOMAIN,
    email: "hr@falcontech.ae",
    mobile: "0500000000",
    pan: "FALCO1234T",
    address: "Sheikh Zayed Road, Business Bay, Dubai, UAE",
    attendancePunchType: "both",
    leavePolicy: [
      { leaveType: "Annual Leave", code: "AL", maxPerYear: 30, accrualFrequency: "monthly", carryForward: true, maxCarryForward: 10, encashable: true, maxEncashable: 10 },
      { leaveType: "Sick Leave", code: "SL", maxPerYear: 15, accrualFrequency: "monthly" },
      { leaveType: "Casual Leave", code: "CL", maxPerYear: 10, accrualFrequency: "monthly" },
    ],
  });
  const organization = org._id;
  console.log("🏢 Organization created:", org.name);

  // --------------------------------------------------------- Departments
  const departments = await DB.Department.insertMany(
    [
      ["Engineering", "ENG"],
      ["Sales", "SAL"],
      ["Finance", "FIN"],
      ["Human Resources", "HR"],
      ["Operations", "OPS"],
    ].map(([name, code]) => ({ organization, name, code, description: `${name} department` }))
  );
  const deptByName = Object.fromEntries(departments.map((d) => [d.name, d._id]));

  // ------------------------------------------------------------- Branches
  const branches = await DB.Branch.insertMany([
    { organization, name: "Dubai HQ", code: "DXB-HQ", emirate: "Dubai", city: "Business Bay", isHeadOffice: true, status: "active", phone: "04-1234567" },
    { organization, name: "Abu Dhabi Office", code: "AUH-01", emirate: "Abu Dhabi", city: "Al Maryah Island", status: "active", phone: "02-7654321" },
    { organization, name: "Sharjah Branch", code: "SHJ-01", emirate: "Sharjah", city: "Al Majaz", status: "active", phone: "06-9876543" },
  ]);

  // -------------------------------------------------------------- Shifts
  const shifts = await DB.Shift.insertMany([
    { organization, name: "General Shift", startTime: "09:00", endTime: "18:00", isOvernight: false, gracePeriodMins: 15, minHalfDayDuration: 240, minFullDayDuration: 480 },
    { organization, name: "Night Shift", startTime: "21:00", endTime: "05:00", isOvernight: true, gracePeriodMins: 15, minHalfDayDuration: 240, minFullDayDuration: 480 },
  ]);

  // ------------------------------------------------------------ People
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const leaveBalances = org.leavePolicy.map((p) => ({ leaveType: p.leaveType, code: p.code, credited: randInt(8, p.maxPerYear), used: randInt(0, 6), carryForwarded: 0 }));

  const specs = [
    // 3 admins
    { name: "Aisha Al Mansoori", designation: "Managing Director", dept: "Human Resources", isSuperAdmin: true, preset: "organizationAdmin", isManager: true },
    { name: "Omar Khan", designation: "HR Director", dept: "Human Resources", preset: "organizationAdmin", isManager: true },
    { name: "Sara Ibrahim", designation: "Finance Director", dept: "Finance", preset: "organizationAdmin", isManager: true },
    // 10 employees
    { name: "Rahul Verma", designation: "Engineering Manager", dept: "Engineering", preset: "employeeManager", isManager: true },
    { name: "Fatima Noor", designation: "Software Engineer", dept: "Engineering", preset: "employee" },
    { name: "James Carter", designation: "Frontend Developer", dept: "Engineering", preset: "employee" },
    { name: "Arjun Mehta", designation: "DevOps Engineer", dept: "Engineering", preset: "employee" },
    { name: "Priya Nair", designation: "Sales Manager", dept: "Sales", preset: "employeeManager", isManager: true },
    { name: "Mohammed Ali", designation: "Account Executive", dept: "Sales", preset: "employee" },
    { name: "Elena Petrova", designation: "Senior Accountant", dept: "Finance", preset: "employee" },
    { name: "David Smith", designation: "Operations Lead", dept: "Operations", preset: "employeeManager", isManager: true },
    { name: "Layla Hassan", designation: "Operations Executive", dept: "Operations", preset: "employee" },
    { name: "Noura Saeed", designation: "HR Executive", dept: "Human Resources", preset: "employee" },
  ];

  const peopleDocs = await DB.Employee.insertMany(
    specs.map((s, i) => ({
      name: s.name,
      email: slugEmail(s.name),
      mobile: `05${50000000 + i}`,
      organization,
      shift: sample(shifts)._id,
      isSuperAdmin: !!s.isSuperAdmin,
      permissions: [...permissionsPresets[s.preset]],
      isActive: true,
      status: "active",
      dob: days(-randInt(8000, 14000)),
      joiningDate: days(-randInt(120, 1500)),
      designation: s.designation,
      empCode: `FT-${1001 + i}`,
      department: deptByName[s.dept],
      hashedPassword,
      bankAccount: `AE0703300${1234567890123 + i}`,
      leaveBalances,
    }))
  );
  console.log(`👥 ${peopleDocs.length} employees created (3 admins + 10 staff)`);

  // managers: super admin reports to none; dept manager reports to super admin; staff report to dept manager
  const superAdmin = peopleDocs[0];
  const mgrByDept = {};
  specs.forEach((s, i) => {
    if (s.isManager && !s.isSuperAdmin) mgrByDept[s.dept] = peopleDocs[i]._id;
  });
  const managerOf = peopleDocs.map((p, i) => {
    const s = specs[i];
    if (s.isSuperAdmin) return null;
    const deptMgr = mgrByDept[s.dept];
    return deptMgr && `${deptMgr}` !== `${p._id}` ? deptMgr : superAdmin._id;
  });
  await DB.Employee.bulkWrite(peopleDocs.map((p, i) => ({ updateOne: { filter: { _id: p._id }, update: { manager: managerOf[i] } } })).filter((_, i) => managerOf[i]));

  const staff = peopleDocs.filter((_, i) => !specs[i].isSuperAdmin && specs[i].preset !== "organizationAdmin");
  const admins = peopleDocs.filter((_, i) => specs[i].preset === "organizationAdmin" || specs[i].isSuperAdmin);
  const financeAdmin = peopleDocs[2];

  // --------------------------------------------------------- Hierarchy
  await DB.Hierarchy.insertMany(peopleDocs.map((p, i) => ({ organization, employee: p._id, reportsTo: managerOf[i], level: specs[i].isSuperAdmin ? 1 : specs[i].isManager ? 2 : 3 })));

  // --------------------------------------------- Workdays + device code
  await DB.Workdays.create({ organization, workDays: [false, true, true, true, true, true, false] });
  await DB.AttendanceCode.create({ organization, deviceId: uuid(), secret: authenticator.generateSecret(), loginPassword: uuid() });

  // set branch headcounts
  await DB.Branch.bulkWrite(branches.map((b, i) => ({ updateOne: { filter: { _id: b._id }, update: { headcount: i === 0 ? 7 : i === 1 ? 4 : 2, manager: admins[i % admins.length]._id } } })));

  // ------------------------------------------------------------- Assets
  const assetCats = ["laptop", "mobile", "vehicle", "furniture", "software", "accessory"];
  const assetNames = { laptop: "MacBook Pro 16”", mobile: "iPhone 15 Pro", vehicle: "Toyota Land Cruiser", furniture: "Ergonomic Chair", software: "Adobe CC License", accessory: "Dell 27” Monitor" };
  const assets = [];
  for (let i = 0; i < 14; i++) {
    const category = sample(assetCats);
    const assignTo = Math.random() > 0.4 ? sample(peopleDocs) : null;
    assets.push({
      organization,
      branch: sample(branches)._id,
      name: assetNames[category],
      assetTag: `AST-${(1000 + i).toString()}`,
      category,
      serialNumber: `SN${randInt(100000, 999999)}`,
      purchaseDate: days(-randInt(60, 900)),
      purchaseCost: randInt(800, 90000),
      warrantyExpiry: days(randInt(-30, 600)),
      status: assignTo ? "assigned" : sample(["available", "maintenance", "available"]),
      assignedTo: assignTo?._id || null,
      assignedDate: assignTo ? days(-randInt(10, 300)) : null,
      condition: sample(["new", "good", "good", "fair"]),
    });
  }
  await DB.Asset.insertMany(assets);

  // ----------------------------------------------------------- Expenses
  const expCats = ["travel", "food", "accommodation", "supplies", "software", "training"];
  const expStatus = ["pending", "approved", "approved", "rejected", "reimbursed"];
  const expenses = [];
  for (let i = 0; i < 18; i++) {
    const cat = sample(expCats);
    expenses.push({
      organization,
      employee: sample(staff)._id,
      title: `${cat[0].toUpperCase() + cat.slice(1)} - ${sample(["client visit", "team offsite", "conference", "monthly", "project"])}`,
      category: cat,
      amount: randInt(120, 9500),
      currency: "AED",
      date: days(-randInt(1, 75)),
      status: sample(expStatus),
      approver: financeAdmin._id,
    });
  }
  await DB.Expense.insertMany(expenses);

  // ------------------------------------------------------ Announcements
  await DB.Announcement.insertMany([
    { organization, title: "Eid Al Adha Holidays", body: "The office will remain closed from the 16th to the 18th. Wishing everyone a blessed Eid!", category: "holiday", priority: "normal", pinned: true, publishedBy: superAdmin._id },
    { organization, title: "New Health Insurance Provider", body: "We have upgraded our medical coverage. New cards will be distributed next week.", category: "policy", priority: "high", publishedBy: peopleDocs[1]._id },
    { organization, title: "Q2 Town Hall", body: "Join us for the quarterly town hall this Thursday at 3 PM in the Dubai HQ auditorium.", category: "event", priority: "normal", publishedBy: superAdmin._id },
    { organization, title: "Congratulations to our Top Performers!", body: "A huge shout-out to the Sales team for exceeding their Q1 target by 24%.", category: "celebration", priority: "low", publishedBy: peopleDocs[1]._id },
    { organization, title: "WPS Salary Processing", body: "May salaries have been processed through the WPS. Payslips are available in the portal.", category: "general", priority: "normal", publishedBy: financeAdmin._id },
  ]);

  // ----------------------------------------------------- Recruitment ATS
  const jobs = await DB.Job.insertMany([
    { organization, title: "Senior Backend Engineer", code: "JOB-001", department: deptByName["Engineering"], employmentType: "full-time", location: "Dubai, UAE", openings: 2, minSalary: 18000, maxSalary: 28000, status: "open", hiringManager: peopleDocs[3]._id },
    { organization, title: "Sales Executive", code: "JOB-002", department: deptByName["Sales"], employmentType: "full-time", location: "Abu Dhabi, UAE", openings: 3, minSalary: 8000, maxSalary: 14000, status: "open", hiringManager: peopleDocs[7]._id },
    { organization, title: "Finance Analyst", code: "JOB-003", department: deptByName["Finance"], employmentType: "contract", location: "Dubai, UAE", openings: 1, minSalary: 12000, maxSalary: 16000, status: "on-hold" },
    { organization, title: "HR Intern", code: "JOB-004", department: deptByName["Human Resources"], employmentType: "internship", location: "Dubai, UAE", openings: 1, minSalary: 3000, maxSalary: 4500, status: "open" },
  ]);
  const stages = ["applied", "applied", "screening", "interview", "offer", "hired", "rejected"];
  const sources = ["referral", "linkedin", "website", "agency", "walk-in"];
  const candFirst = ["Hassan", "Mariam", "Yusuf", "Aaliyah", "Khalid", "Zainab", "Bilal", "Reem", "Tariq", "Hana", "Saeed", "Mona"];
  const candidates = candFirst.map((fn, i) => ({
    organization,
    job: sample(jobs)._id,
    name: `${fn} ${sample(["Al Hashimi", "Rashid", "Bakr", "Sultan", "Aziz"])}`,
    email: `${fn.toLowerCase()}${i}@example.com`,
    phone: `0555${randInt(100000, 999999)}`,
    source: sample(sources),
    stage: sample(stages),
    rating: randInt(2, 5),
    expectedSalary: randInt(6000, 26000),
    noticePeriodDays: sample([0, 30, 60, 90]),
  }));
  await DB.Candidate.insertMany(candidates);

  // ------------------------------------------------------- Performance
  const competencies = ["Communication", "Technical Skill", "Teamwork", "Ownership", "Leadership"];
  await DB.PerformanceReview.insertMany(
    sampleMany(staff, 7).map((e) => {
      const ratings = competencies.map((c) => ({ competency: c, score: randInt(2, 5) }));
      const overall = +(ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1);
      return { organization, employee: e._id, reviewer: sample(admins)._id, cycle: "2026-H1", period: "half-yearly", ratings, overallRating: overall, goalsAchieved: randInt(1, 5), status: sample(["draft", "self-review", "manager-review", "completed", "completed"]), strengths: "Reliable and proactive contributor.", improvements: "Could improve documentation habits." };
    })
  );
  const goalCats = ["business", "personal", "team", "learning"];
  const goalStatuses = ["not-started", "in-progress", "in-progress", "completed", "overdue"];
  await DB.Goal.insertMany(
    Array.from({ length: 12 }).map(() => {
      const progress = randInt(0, 100);
      const status = progress >= 100 ? "completed" : sample(goalStatuses);
      return { organization, employee: sample(staff)._id, title: sample(["Increase regional revenue by 20%", "Ship the new mobile app", "Reduce onboarding time", "Complete AWS certification", "Improve CSAT to 90%", "Automate monthly reporting"]), category: sample(goalCats), weightage: sample([25, 50, 75, 100]), progress, status, dueDate: days(randInt(-30, 120)) };
    })
  );

  // -------------------------------------------------------- Documents
  await DB.CompanyDocument.insertMany([
    { organization, title: "Trade License 2026", category: "license", fileUrl: "https://example.com/docs/trade-license.pdf", fileType: "pdf", version: "2.0", owner: financeAdmin._id, expiresAt: days(120) },
    { organization, title: "Employee Handbook", category: "handbook", fileUrl: "https://example.com/docs/handbook.pdf", fileType: "pdf", version: "3.1", owner: peopleDocs[1]._id },
    { organization, title: "Code of Conduct Policy", category: "policy", fileUrl: "https://example.com/docs/code-of-conduct.pdf", fileType: "pdf", owner: superAdmin._id },
    { organization, title: "Office Lease Agreement", category: "contract", fileUrl: "https://example.com/docs/lease.pdf", fileType: "pdf", expiresAt: days(20), owner: financeAdmin._id },
    { organization, title: "ISO 9001 Certificate", category: "certificate", fileUrl: "https://example.com/docs/iso.pdf", fileType: "pdf", expiresAt: days(300) },
    { organization, title: "Leave Request Form", category: "form", fileUrl: "https://example.com/docs/leave-form.pdf", fileType: "pdf", owner: peopleDocs[1]._id },
  ]);

  // ---------------------------------------------------- Approvals
  await DB.ApprovalRequest.insertMany([
    { organization, title: "Purchase 5 new laptops", type: "asset", requestedBy: peopleDocs[3]._id, amount: 45000, priority: "high", status: "pending", currentStep: 1, steps: [{ order: 1, approver: peopleDocs[3]._id, role: "Manager", status: "approved", actionedAt: days(-2) }, { order: 2, approver: financeAdmin._id, role: "Finance", status: "pending" }] },
    { organization, title: "Annual leave - 12 days", type: "leave", requestedBy: sample(staff)._id, priority: "normal", status: "pending", currentStep: 0, steps: [{ order: 1, approver: superAdmin._id, role: "HR", status: "pending" }] },
    { organization, title: "Conference travel reimbursement", type: "expense", requestedBy: sample(staff)._id, amount: 8200, priority: "normal", status: "approved" },
    { organization, title: "New hire offer - Backend Engineer", type: "recruitment", requestedBy: peopleDocs[3]._id, amount: 26000, priority: "high", status: "pending", currentStep: 0, steps: [{ order: 1, approver: superAdmin._id, role: "MD", status: "pending" }] },
    { organization, title: "Software subscription renewal", type: "expense", requestedBy: sample(staff)._id, amount: 3400, priority: "low", status: "rejected" },
    { organization, title: "Office supplies restock", type: "custom", requestedBy: sample(staff)._id, amount: 1200, priority: "normal", status: "approved" },
  ]);

  // ------------------------------------------------ UAE Compliance
  const docTypes = ["emirates-id", "residence-visa", "labour-card", "passport", "work-permit"];
  const emirates = ["Dubai", "Abu Dhabi", "Sharjah"];
  const compliance = [];
  peopleDocs.forEach((e, i) => {
    // give most people an Emirates ID + visa, with varied expiries
    const expiries = [days(randInt(-25, 350)), days(randInt(10, 400))];
    [docTypes[0], sample(docTypes.slice(1))].forEach((documentType, j) => {
      const expiryDate = expiries[j];
      compliance.push({ organization, employee: e._id, documentType, documentNumber: `784-${randInt(1980, 2002)}-${randInt(1000000, 9999999)}-${randInt(1, 9)}`, issuingEmirate: sample(emirates), issueDate: days(-randInt(400, 1500)), expiryDate, status: compStatus(expiryDate) });
    });
  });
  await DB.ComplianceRecord.insertMany(compliance);

  // ------------------------------------------------ Biometric devices
  await DB.BiometricDevice.insertMany([
    { organization, branch: branches[0]._id, name: "Main Entrance Terminal", serialNumber: "ZK-DXB-001", deviceType: "face", vendor: "ZKTeco", ipAddress: "192.168.1.50", location: "Dubai HQ Lobby", enrolledUsers: 7, lastSyncAt: days(0), status: "online" },
    { organization, branch: branches[0]._id, name: "Server Room Access", serialNumber: "ZK-DXB-002", deviceType: "fingerprint", vendor: "ZKTeco", ipAddress: "192.168.1.51", location: "Dubai HQ Floor 3", enrolledUsers: 4, lastSyncAt: days(0), status: "online" },
    { organization, branch: branches[1]._id, name: "AUH Entrance", serialNumber: "ZK-AUH-001", deviceType: "hybrid", vendor: "Suprema", location: "Abu Dhabi Reception", enrolledUsers: 4, lastSyncAt: days(-1), status: "offline" },
    { organization, branch: branches[2]._id, name: "Sharjah Gate", serialNumber: "ZK-SHJ-001", deviceType: "rfid", vendor: "Hikvision", location: "Sharjah Entrance", enrolledUsers: 2, status: "maintenance" },
  ]);

  // ----------------------------------------------- CTC + Payroll (WPS)
  const ctcDocs = [];
  const payrolls = [];
  for (const e of peopleDocs) {
    const annual = randInt(72000, 360000);
    const monthlyGross = Math.round(annual / 12);
    const basic = Math.round(monthlyGross * 0.6);
    const housing = Math.round(monthlyGross * 0.25);
    const transport = monthlyGross - basic - housing;
    const deduction = Math.round(monthlyGross * 0.05);
    ctcDocs.push({
      organization,
      employee: e._id,
      financialYear: "2026-27",
      totalCTC: annual,
      earnings: [
        { name: "Basic", annualAmount: basic * 12, type: "earnings", inHandComponent: true },
        { name: "Housing Allowance", annualAmount: housing * 12, type: "earnings", inHandComponent: true },
        { name: "Transport Allowance", annualAmount: transport * 12, type: "earnings", inHandComponent: true },
      ],
      deductions: [{ name: "Insurance", annualAmount: deduction * 12, type: "deductions", inHandComponent: true }],
    });
    const presentDays = randInt(19, 22);
    payrolls.push({
      organization,
      employee: e._id,
      month: monthName,
      status: "processed",
      totalWorkingDays: 22,
      presentDays,
      grossSalary: monthlyGross,
      netSalary: monthlyGross - deduction,
      financialYear: "2026-27",
      components: [
        { name: "Basic", amount: basic, type: "earnings", inHandComponent: true },
        { name: "Housing Allowance", amount: housing, type: "earnings", inHandComponent: true },
        { name: "Transport Allowance", amount: transport, type: "earnings", inHandComponent: true },
        { name: "Insurance", amount: deduction, type: "deductions", inHandComponent: false },
      ],
    });
  }
  await DB.CTC.insertMany(ctcDocs);
  await DB.Payroll.insertMany(payrolls);

  // --------------------------------------------- WPS batch (generated)
  const wpsRecords = peopleDocs.map((e, i) => {
    const p = payrolls[i];
    return { employee: e._id, employeeName: e.name, labourCardNumber: e.empCode, routingCode: "603456", iban: e.bankAccount, basicSalary: p.grossSalary, variablePay: 0, deductions: p.grossSalary - p.netSalary, netSalary: p.netSalary, daysOnLeave: p.totalWorkingDays - p.presentDays };
  });
  const wpsMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  await DB.WpsBatch.create({ organization, month: wpsMonth, employerId: "EID2026FALCON", bankRoutingCode: "603456", totalRecords: wpsRecords.length, totalAmount: wpsRecords.reduce((s, r) => s + r.netSalary, 0), currency: "AED", records: wpsRecords, status: "generated", sifFileName: `WPS_${organization}_${wpsMonth}.sif`, generatedBy: superAdmin._id });

  // ----------------------------------------------------- Attendance
  const attendance = [];
  for (let d = 1; d <= 12; d++) {
    const dateVal = startOfDay(days(-d));
    const dow = new Date(dateVal * 1000).getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends
    for (const e of peopleDocs) {
      const roll = Math.random();
      const status = roll > 0.9 ? "leave" : roll > 0.82 ? "absent" : "present";
      const checkIn = status === "present" ? dateVal + 9 * 3600 + randInt(-600, 1800) : undefined;
      const checkOut = status === "present" ? dateVal + 18 * 3600 + randInt(-1200, 2400) : undefined;
      attendance.push({ organization, employee: e._id, date: dateVal, status, ...(checkIn ? { checkIn } : {}), ...(checkOut ? { checkOut } : {}), punchType: "qr" });
    }
  }
  await DB.Attendance.insertMany(attendance);
  console.log(`🕒 ${attendance.length} attendance records seeded`);

  // ------------------------------------------------------ Leave requests
  await DB.LeaveRequest.insertMany(
    sampleMany(staff, 6).map((e, i) => ({ organization, employee: e._id, owner: e._id, leaveType: sample(["Annual Leave", "Sick Leave", "Casual Leave"]), fromDate: days(randInt(2, 20)), toDate: days(randInt(21, 30)), days: randInt(1, 5), status: sample(["pending", "approved", "pending", "rejected"]), reason: sample(["Family vacation", "Medical", "Personal", "Travel"]) }))
  );

  // ----------------------------------------------------------- Holidays
  await DB.Holiday.insertMany([
    { organization, financialYear: "2026-27", name: "Eid Al Adha", date: days(20), remarks: "Public holiday" },
    { organization, financialYear: "2026-27", name: "Islamic New Year", date: days(55), remarks: "Public holiday" },
    { organization, financialYear: "2026-27", name: "UAE National Day", date: days(170), remarks: "National holiday" },
    { organization, financialYear: "2026-27", name: "Commemoration Day", date: days(160), remarks: "National holiday" },
  ]);

  // ------------------------------------------------------------ Summary
  console.log("\n✅ Seed complete!\n");
  console.log("──────────────────────────────────────────────");
  console.log("  Login credentials (password for all: " + PASSWORD + ")");
  console.log("──────────────────────────────────────────────");
  console.log("  Super Admin :", slugEmail("Aisha Al Mansoori"));
  console.log("  HR Admin    :", slugEmail("Omar Khan"));
  console.log("  Finance     :", slugEmail("Sara Ibrahim"));
  console.log("  Staff (x10) : e.g.", slugEmail("Fatima Noor"));
  console.log("──────────────────────────────────────────────");
  console.log("  Org:", org.name, "·", DEMO_DOMAIN);
  console.log("  Departments:", departments.length, "| Branches:", branches.length, "| Assets:", assets.length);
  console.log("  Candidates:", candidates.length, "| Compliance docs:", compliance.length, "| Attendance:", attendance.length);
  console.log("──────────────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
