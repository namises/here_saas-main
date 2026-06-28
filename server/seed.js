// server/seed.js
// Seeds a few self-contained demo organizations, each with admins, managers and
// 100+ employees across every module so all dashboards/charts populate for testing.
//
//   Run:  yarn seed      (or)   node server/seed.js
//
// Re-runnable: it wipes and recreates the demo orgs (scoped by domain) only.
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { authenticator } from "otplib";
import DB from "./db/index.js";
import permissionsPresets from "./utils/permissionsPresets.js";

const PASSWORD = "password123";
const EMPLOYEES_PER_COMPANY = 108; // 1 super admin + 2 org admins + 5 dept managers + 100 staff

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
const sampleMany = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const compStatus = (exp) => {
  const d = exp - nowSec;
  if (d < 0) return "expired";
  if (d < 30 * DAY) return "expiring-soon";
  return "valid";
};

// ----------------------------------------------------------- Demo companies
const COMPANIES = [
  {
    name: "Falcon Technologies LLC",
    domain: "falcontech.ae",
    email: "hr@falcontech.ae",
    mobile: "0500000000",
    pan: "FALCO1234T",
    address: "Sheikh Zayed Road, Business Bay, Dubai, UAE",
    empPrefix: "FT",
    employerId: "EID2026FALCON",
    branches: [
      { name: "Dubai HQ", code: "DXB-HQ", emirate: "Dubai", city: "Business Bay", isHeadOffice: true, status: "active", phone: "04-1234567" },
      { name: "Abu Dhabi Office", code: "AUH-01", emirate: "Abu Dhabi", city: "Al Maryah Island", status: "active", phone: "02-7654321" },
      { name: "Sharjah Branch", code: "SHJ-01", emirate: "Sharjah", city: "Al Majaz", status: "active", phone: "06-9876543" },
    ],
  },
  {
    name: "Oasis Retail Group",
    domain: "oasisretail.ae",
    email: "hr@oasisretail.ae",
    mobile: "0500000001",
    pan: "OASIS5678R",
    address: "Al Wasl Road, Jumeirah, Dubai, UAE",
    empPrefix: "OR",
    employerId: "EID2026OASIS",
    branches: [
      { name: "Jumeirah HQ", code: "JUM-HQ", emirate: "Dubai", city: "Jumeirah", isHeadOffice: true, status: "active", phone: "04-2223344" },
      { name: "Deira Outlet", code: "DEI-01", emirate: "Dubai", city: "Deira", status: "active", phone: "04-5566778" },
      { name: "Al Ain Store", code: "AAN-01", emirate: "Abu Dhabi", city: "Al Ain", status: "active", phone: "03-7788990" },
    ],
  },
  {
    name: "Marina Logistics FZE",
    domain: "marinalog.ae",
    email: "hr@marinalog.ae",
    mobile: "0500000002",
    pan: "MARIN9012L",
    address: "Jebel Ali Free Zone, Dubai, UAE",
    empPrefix: "ML",
    employerId: "EID2026MARINA",
    branches: [
      { name: "Jebel Ali HQ", code: "JAFZ-HQ", emirate: "Dubai", city: "Jebel Ali", isHeadOffice: true, status: "active", phone: "04-8001122" },
      { name: "Mussafah Depot", code: "MUS-01", emirate: "Abu Dhabi", city: "Mussafah", status: "active", phone: "02-9002233" },
      { name: "RAK Yard", code: "RAK-01", emirate: "Ras Al Khaimah", city: "Al Hamra", status: "active", phone: "07-1003344" },
    ],
  },
];

const LEAVE_POLICY = [
  { leaveType: "Annual Leave", code: "AL", maxPerYear: 30, accrualFrequency: "monthly", carryForward: true, maxCarryForward: 10, encashable: true, maxEncashable: 10 },
  { leaveType: "Sick Leave", code: "SL", maxPerYear: 15, accrualFrequency: "monthly" },
  { leaveType: "Casual Leave", code: "CL", maxPerYear: 10, accrualFrequency: "monthly" },
];

const DEPARTMENTS = [
  ["Engineering", "ENG"],
  ["Sales", "SAL"],
  ["Finance", "FIN"],
  ["Human Resources", "HR"],
  ["Operations", "OPS"],
];
const DEPT_NAMES = DEPARTMENTS.map(([name]) => name);

const DESIGNATIONS = {
  Engineering: ["Software Engineer", "Senior Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "QA Engineer", "Mobile Developer", "Data Engineer", "Solutions Architect"],
  Sales: ["Sales Executive", "Account Executive", "Business Development Rep", "Sales Associate", "Key Account Manager", "Inside Sales Rep"],
  Finance: ["Accountant", "Senior Accountant", "Financial Analyst", "Payroll Specialist", "Auditor", "Treasury Officer"],
  "Human Resources": ["HR Executive", "Recruiter", "HR Generalist", "Talent Acquisition Specialist", "HR Coordinator", "L&D Specialist"],
  Operations: ["Operations Executive", "Logistics Coordinator", "Operations Analyst", "Facilities Coordinator", "Procurement Officer", "Warehouse Supervisor"],
};

// Name pools — large enough that combined with a uniqueness suffix every employee gets a distinct email.
const FIRST_NAMES = [
  "Aisha", "Omar", "Sara", "Rahul", "Fatima", "James", "Arjun", "Priya", "Mohammed", "Elena", "David", "Layla", "Noura", "Hassan", "Mariam",
  "Yusuf", "Aaliyah", "Khalid", "Zainab", "Bilal", "Reem", "Tariq", "Hana", "Saeed", "Mona", "Imran", "Nadia", "Faisal", "Huda", "Karim",
  "Salma", "Rashed", "Leen", "Adnan", "Dana", "Hamza", "Yara", "Sami", "Lina", "Waleed", "Maya", "Zaid", "Rana", "Nabil", "Asma",
  "Ravi", "Anika", "Vikram", "Pooja", "Daniel", "Sophia", "Lucas", "Olivia", "Ethan", "Amira", "Tomas", "Ines", "Marco", "Yasmin", "Hadi",
];
const LAST_NAMES = [
  "Al Mansoori", "Khan", "Ibrahim", "Verma", "Noor", "Carter", "Mehta", "Nair", "Ali", "Petrova", "Smith", "Hassan", "Saeed", "Al Hashimi",
  "Rashid", "Bakr", "Sultan", "Aziz", "Sharma", "Patel", "Hussain", "Farouk", "Mansour", "Haddad", "Nasser", "Saleh", "Kapoor", "Reddy",
  "Costa", "Silva", "Fernandes", "Lopez", "Murphy", "Brown", "Khoury", "Darwish", "Abboud", "Habib", "Iqbal", "Rahman",
];

const pickName = () => `${sample(FIRST_NAMES)} ${sample(LAST_NAMES)}`;

// Employee.mobile carries a global unique index, so hand out distinct numbers across all companies.
let mobileSeq = 0;
const nextMobile = () => `05${50000000 + mobileSeq++}`;

// Builds the role/designation spec list for a single company (100+ employees).
function buildSpecs() {
  const specs = [
    { name: pickName(), designation: "Managing Director", dept: "Human Resources", isSuperAdmin: true, preset: "organizationAdmin", isManager: true },
    { name: pickName(), designation: "HR Director", dept: "Human Resources", preset: "organizationAdmin", isManager: true },
    { name: pickName(), designation: "Finance Director", dept: "Finance", preset: "organizationAdmin", isManager: true },
  ];
  for (const dept of DEPT_NAMES) {
    specs.push({ name: pickName(), designation: `${dept} Manager`, dept, preset: "employeeManager", isManager: true });
  }
  // Rotate the per-employee attendance punch method across staff so both methods are
  // testable: "selfie" => selfie+location only, "qr" => device/QR only, null => org default.
  const PUNCH_ROTATION = ["selfie", "qr", null];
  let staffIdx = 0;
  while (specs.length < EMPLOYEES_PER_COMPANY) {
    const dept = sample(DEPT_NAMES);
    specs.push({ name: pickName(), designation: sample(DESIGNATIONS[dept]), dept, preset: "employee", attendancePunchType: PUNCH_ROTATION[staffIdx++ % PUNCH_ROTATION.length] });
  }
  return specs;
}

// Per-domain unique email generator (collisions get a numeric suffix).
function emailMaker(domain) {
  const used = new Set();
  return (name) => {
    const base = name.toLowerCase().replace(/[^a-z ]/g, "").trim().replace(/\s+/g, ".");
    let email = `${base}@${domain}`;
    let n = 1;
    while (used.has(email)) email = `${base}${n++}@${domain}`;
    used.add(email);
    return email;
  };
}

async function cleanup(orgId) {
  const models = [
    "Employee", "Department", "Branch", "Shift", "Hierarchy", "Workdays", "AttendanceCode", "Attendance", "LeaveRequest", "Holiday", "CTC", "Payroll",
    "Asset", "Expense", "Announcement", "Job", "Candidate", "PerformanceReview", "Goal", "CompanyDocument", "ApprovalRequest", "ComplianceRecord", "WpsBatch", "BiometricDevice",
  ];
  await Promise.all(models.map((m) => DB[m].deleteMany({ organization: orgId })));
  await DB.Organization.deleteOne({ _id: orgId });
}

// --------------------------------------------------------- Seed one company
async function seedOrganization(company, hashedPassword) {
  // ----------------------------------------------------------------- Org
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
  console.log("🏢 Organization created:", org.name);

  // --------------------------------------------------------- Departments
  const departments = await DB.Department.insertMany(DEPARTMENTS.map(([name, code]) => ({ organization, name, code, description: `${name} department` })));
  const deptByName = Object.fromEntries(departments.map((d) => [d.name, d._id]));

  // ------------------------------------------------------------- Branches
  const branches = await DB.Branch.insertMany(company.branches.map((b) => ({ organization, ...b })));

  // -------------------------------------------------------------- Shifts
  const shifts = await DB.Shift.insertMany([
    { organization, name: "General Shift", startTime: "09:00", endTime: "18:00", isOvernight: false, gracePeriodMins: 15, minHalfDayDuration: 240, minFullDayDuration: 480 },
    { organization, name: "Night Shift", startTime: "21:00", endTime: "05:00", isOvernight: true, gracePeriodMins: 15, minHalfDayDuration: 240, minFullDayDuration: 480 },
  ]);

  // ------------------------------------------------------------ People
  const specs = buildSpecs();
  const slugEmail = emailMaker(company.domain);
  const leaveBalances = LEAVE_POLICY.map((p) => ({ leaveType: p.leaveType, code: p.code, credited: randInt(8, p.maxPerYear), used: randInt(0, 6), carryForwarded: 0 }));

  const peopleDocs = await DB.Employee.insertMany(
    specs.map((s, i) => ({
      name: s.name,
      email: slugEmail(s.name),
      mobile: nextMobile(),
      organization,
      shift: sample(shifts)._id,
      isSuperAdmin: !!s.isSuperAdmin,
      permissions: [...permissionsPresets[s.preset]],
      isActive: true,
      status: "active",
      dob: days(-randInt(8000, 14000)),
      joiningDate: days(-randInt(120, 1500)),
      designation: s.designation,
      empCode: `${company.empPrefix}-${1001 + i}`,
      department: deptByName[s.dept],
      hashedPassword,
      bankAccount: `AE07033${(1234567890123 + i).toString().slice(0, 13)}`,
      leaveBalances,
      attendancePunchType: s.attendancePunchType ?? null,
    }))
  );

  // managers: super admin reports to none; org admins + dept managers report to super admin; staff report to their dept manager
  const superAdmin = peopleDocs[0];
  const financeAdmin = peopleDocs[2];
  const mgrIdByDept = {};
  const mgrDocByDept = {};
  specs.forEach((s, i) => {
    if (s.preset === "employeeManager") {
      mgrIdByDept[s.dept] = peopleDocs[i]._id;
      mgrDocByDept[s.dept] = peopleDocs[i];
    }
  });
  const managerOf = peopleDocs.map((p, i) => {
    const s = specs[i];
    if (s.isSuperAdmin) return null;
    if (s.preset !== "employee") return superAdmin._id;
    const deptMgr = mgrIdByDept[s.dept];
    return deptMgr && `${deptMgr}` !== `${p._id}` ? deptMgr : superAdmin._id;
  });
  await DB.Employee.bulkWrite(peopleDocs.map((p, i) => ({ updateOne: { filter: { _id: p._id }, update: { manager: managerOf[i] } } })).filter((_, i) => managerOf[i]));

  const staff = peopleDocs.filter((_, i) => specs[i].preset === "employee");
  const admins = peopleDocs.filter((_, i) => specs[i].preset === "organizationAdmin" || specs[i].isSuperAdmin);

  // --------------------------------------------------------- Hierarchy
  await DB.Hierarchy.insertMany(peopleDocs.map((p, i) => ({ organization, employee: p._id, reportsTo: managerOf[i], level: specs[i].isSuperAdmin ? 1 : specs[i].isManager ? 2 : 3 })));

  // --------------------------------------------- Workdays + device code
  await DB.Workdays.create({ organization, workDays: [false, true, true, true, true, true, false] });
  await DB.AttendanceCode.create({ organization, deviceId: uuid(), secret: authenticator.generateSecret(), loginPassword: uuid() });

  // set branch headcounts (≈ 50% / 30% / 20% split across the three branches)
  const total = peopleDocs.length;
  const headcounts = [Math.round(total * 0.5), Math.round(total * 0.3)];
  headcounts.push(total - headcounts[0] - headcounts[1]);
  await DB.Branch.bulkWrite(branches.map((b, i) => ({ updateOne: { filter: { _id: b._id }, update: { headcount: headcounts[i] ?? 0, manager: admins[i % admins.length]._id } } })));

  // ------------------------------------------------------------- Assets
  const assetCats = ["laptop", "mobile", "vehicle", "furniture", "software", "accessory"];
  const assetNames = { laptop: "MacBook Pro 16”", mobile: "iPhone 15 Pro", vehicle: "Toyota Land Cruiser", furniture: "Ergonomic Chair", software: "Adobe CC License", accessory: "Dell 27” Monitor" };
  const assetCount = Math.round(total * 0.6);
  const assets = [];
  for (let i = 0; i < assetCount; i++) {
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
  for (let i = 0; i < 30; i++) {
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
    { organization, title: "Q2 Town Hall", body: "Join us for the quarterly town hall this Thursday at 3 PM in the HQ auditorium.", category: "event", priority: "normal", publishedBy: superAdmin._id },
    { organization, title: "Congratulations to our Top Performers!", body: "A huge shout-out to the Sales team for exceeding their Q1 target by 24%.", category: "celebration", priority: "low", publishedBy: peopleDocs[1]._id },
    { organization, title: "WPS Salary Processing", body: "May salaries have been processed through the WPS. Payslips are available in the portal.", category: "general", priority: "normal", publishedBy: financeAdmin._id },
  ]);

  // ----------------------------------------------------- Recruitment ATS
  const jobs = await DB.Job.insertMany([
    { organization, title: "Senior Backend Engineer", code: "JOB-001", department: deptByName["Engineering"], employmentType: "full-time", location: "Dubai, UAE", openings: 2, minSalary: 18000, maxSalary: 28000, status: "open", hiringManager: mgrDocByDept["Engineering"]?._id },
    { organization, title: "Sales Executive", code: "JOB-002", department: deptByName["Sales"], employmentType: "full-time", location: "Abu Dhabi, UAE", openings: 3, minSalary: 8000, maxSalary: 14000, status: "open", hiringManager: mgrDocByDept["Sales"]?._id },
    { organization, title: "Finance Analyst", code: "JOB-003", department: deptByName["Finance"], employmentType: "contract", location: "Dubai, UAE", openings: 1, minSalary: 12000, maxSalary: 16000, status: "on-hold", hiringManager: mgrDocByDept["Finance"]?._id },
    { organization, title: "HR Intern", code: "JOB-004", department: deptByName["Human Resources"], employmentType: "internship", location: "Dubai, UAE", openings: 1, minSalary: 3000, maxSalary: 4500, status: "open", hiringManager: mgrDocByDept["Human Resources"]?._id },
  ]);
  const stages = ["applied", "applied", "screening", "interview", "offer", "hired", "rejected"];
  const sources = ["referral", "linkedin", "website", "agency", "walk-in"];
  const candidates = Array.from({ length: 15 }).map((_, i) => ({
    organization,
    job: sample(jobs)._id,
    name: pickName(),
    email: `candidate${i}.${company.empPrefix.toLowerCase()}@example.com`,
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
    sampleMany(staff, 20).map((e) => {
      const ratings = competencies.map((c) => ({ competency: c, score: randInt(2, 5) }));
      const overall = +(ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1);
      return { organization, employee: e._id, reviewer: sample(admins)._id, cycle: "2026-H1", period: "half-yearly", ratings, overallRating: overall, goalsAchieved: randInt(1, 5), status: sample(["draft", "self-review", "manager-review", "completed", "completed"]), strengths: "Reliable and proactive contributor.", improvements: "Could improve documentation habits." };
    })
  );
  const goalCats = ["business", "personal", "team", "learning"];
  const goalStatuses = ["not-started", "in-progress", "in-progress", "completed", "overdue"];
  await DB.Goal.insertMany(
    Array.from({ length: 25 }).map(() => {
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
  const engMgr = mgrDocByDept["Engineering"] || superAdmin;
  await DB.ApprovalRequest.insertMany([
    { organization, title: "Purchase 5 new laptops", type: "asset", requestedBy: engMgr._id, amount: 45000, priority: "high", status: "pending", currentStep: 1, steps: [{ order: 1, approver: engMgr._id, role: "Manager", status: "approved", actionedAt: days(-2) }, { order: 2, approver: financeAdmin._id, role: "Finance", status: "pending" }] },
    { organization, title: "Annual leave - 12 days", type: "leave", requestedBy: sample(staff)._id, priority: "normal", status: "pending", currentStep: 0, steps: [{ order: 1, approver: superAdmin._id, role: "HR", status: "pending" }] },
    { organization, title: "Conference travel reimbursement", type: "expense", requestedBy: sample(staff)._id, amount: 8200, priority: "normal", status: "approved" },
    { organization, title: "New hire offer - Backend Engineer", type: "recruitment", requestedBy: engMgr._id, amount: 26000, priority: "high", status: "pending", currentStep: 0, steps: [{ order: 1, approver: superAdmin._id, role: "MD", status: "pending" }] },
    { organization, title: "Software subscription renewal", type: "expense", requestedBy: sample(staff)._id, amount: 3400, priority: "low", status: "rejected" },
    { organization, title: "Office supplies restock", type: "custom", requestedBy: sample(staff)._id, amount: 1200, priority: "normal", status: "approved" },
  ]);

  // ------------------------------------------------ UAE Compliance
  const docTypes = ["emirates-id", "residence-visa", "labour-card", "passport", "work-permit"];
  const emirates = ["Dubai", "Abu Dhabi", "Sharjah"];
  const compliance = [];
  peopleDocs.forEach((e) => {
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
    { organization, branch: branches[0]._id, name: "Main Entrance Terminal", serialNumber: `ZK-${company.empPrefix}-001`, deviceType: "face", vendor: "ZKTeco", ipAddress: "192.168.1.50", location: `${branches[0].name} Lobby`, enrolledUsers: headcounts[0], lastSyncAt: days(0), status: "online" },
    { organization, branch: branches[0]._id, name: "Server Room Access", serialNumber: `ZK-${company.empPrefix}-002`, deviceType: "fingerprint", vendor: "ZKTeco", ipAddress: "192.168.1.51", location: `${branches[0].name} Floor 3`, enrolledUsers: Math.round(headcounts[0] / 3), lastSyncAt: days(0), status: "online" },
    { organization, branch: branches[1]._id, name: `${branches[1].name} Entrance`, serialNumber: `ZK-${company.empPrefix}-003`, deviceType: "hybrid", vendor: "Suprema", location: `${branches[1].name} Reception`, enrolledUsers: headcounts[1], lastSyncAt: days(-1), status: "offline" },
    { organization, branch: branches[2]._id, name: `${branches[2].name} Gate`, serialNumber: `ZK-${company.empPrefix}-004`, deviceType: "rfid", vendor: "Hikvision", location: `${branches[2].name} Entrance`, enrolledUsers: headcounts[2], status: "maintenance" },
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
  await DB.WpsBatch.create({ organization, month: wpsMonth, employerId: company.employerId, bankRoutingCode: "603456", totalRecords: wpsRecords.length, totalAmount: wpsRecords.reduce((s, r) => s + r.netSalary, 0), currency: "AED", records: wpsRecords, status: "generated", sifFileName: `WPS_${organization}_${wpsMonth}.sif`, generatedBy: superAdmin._id });

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

  // ------------------------------------------------------ Leave requests
  await DB.LeaveRequest.insertMany(
    sampleMany(staff, 15).map((e) => ({ organization, employee: e._id, owner: e._id, leaveType: sample(["Annual Leave", "Sick Leave", "Casual Leave"]), fromDate: days(randInt(2, 20)), toDate: days(randInt(21, 30)), days: randInt(1, 5), status: sample(["pending", "approved", "pending", "rejected"]), reason: sample(["Family vacation", "Medical", "Personal", "Travel"]) }))
  );

  // ----------------------------------------------------------- Holidays
  await DB.Holiday.insertMany([
    { organization, financialYear: "2026-27", name: "Eid Al Adha", date: days(20), remarks: "Public holiday" },
    { organization, financialYear: "2026-27", name: "Islamic New Year", date: days(55), remarks: "Public holiday" },
    { organization, financialYear: "2026-27", name: "UAE National Day", date: days(170), remarks: "National holiday" },
    { organization, financialYear: "2026-27", name: "Commemoration Day", date: days(160), remarks: "National holiday" },
  ]);

  console.log(`   👥 ${peopleDocs.length} employees (1 super admin + 2 org admins + ${Object.keys(mgrIdByDept).length} managers + ${staff.length} staff) · 🕒 ${attendance.length} attendance · 💰 ${payrolls.length} payslips`);

  const selfieStaff = peopleDocs.find((_, i) => specs[i].preset === "employee" && specs[i].attendancePunchType === "selfie");
  const qrStaff = peopleDocs.find((_, i) => specs[i].preset === "employee" && specs[i].attendancePunchType === "qr");

  return {
    org,
    counts: { employees: peopleDocs.length, attendance: attendance.length, assets: assets.length, compliance: compliance.length },
    logins: { superAdmin: peopleDocs[0].email, hrAdmin: peopleDocs[1].email, finance: peopleDocs[2].email, staff: staff[0].email, staffSelfie: selfieStaff?.email, staffQr: qrStaff?.email },
  };
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔌 Connected to MongoDB");

  // wipe any previous demo orgs (scoped by their domains)
  for (const company of COMPANIES) {
    const existing = await DB.Organization.findOne({ domain: company.domain });
    if (existing) {
      console.log(`♻️  Removing previous demo org… (${company.domain})`);
      await cleanup(existing._id);
    }
  }

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const results = [];
  for (const company of COMPANIES) {
    results.push(await seedOrganization(company, hashedPassword));
  }

  // ------------------------------------------------------------ Summary
  const totalEmployees = results.reduce((s, r) => s + r.counts.employees, 0);
  console.log("\n✅ Seed complete!\n");
  console.log("════════════════════════════════════════════════════════");
  console.log(`  ${results.length} companies · ${totalEmployees} employees total`);
  console.log(`  Password for every account: ${PASSWORD}`);
  console.log("════════════════════════════════════════════════════════");
  for (const r of results) {
    console.log(`\n  🏢 ${r.org.name}  ·  ${r.org.domain}  (${r.counts.employees} employees)`);
    console.log("     Super Admin      :", r.logins.superAdmin);
    console.log("     HR Admin         :", r.logins.hrAdmin);
    console.log("     Finance          :", r.logins.finance);
    console.log("     Staff (portal)   :", r.logins.staff);
    console.log("     Staff · selfie   :", r.logins.staffSelfie, "(selfie+location punch only)");
    console.log("     Staff · QR       :", r.logins.staffQr, "(QR/device punch only)");
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
