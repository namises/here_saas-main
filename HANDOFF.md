# Employee Self-Service Portal — Handoff

> Living progress file. **Resume from Phase 6 (Remaining / follow-ups) — Phases 1–5 are built & build-verified.**
> Legend: `[x] DONE` · `[~] ACTIVE` (in progress, may be partial) · `[ ] PENDING`
> Last updated: 2026-06-27
>
> **Status:** Employee Portal foundation + core pages shipped and `yarn build` passes. Not yet manually
> run against a live employee login — verify by logging in as a non-admin employee (created via Add Employee).

## Goal
The app currently shows **every** logged-in user the full admin dashboard/sidebar.
Regular employees (created via Add Employee, `permissionsPresets.employee`) must instead get a
**separate, restricted Employee Portal** exposing only self-service features:
Mark Attendance · My Attendance (calendar) · Profile · Leaves · Announcements · Set Alarm ·
Request Reimbursement · Notes · Holidays · Documents · CRM.

## Key architecture facts (verified 2026-06-27)
- **Login is via the `Employee` collection** (`server/controllers/auth/login.js`). Admins are Employees
  with `isSuperAdmin:true` + `permissionsPresets.organizationAdmin`. Regular employees get
  `permissionsPresets.employee` (see `server/utils/permissionsPresets.js`).
- Client redux `state.user` = full employee object incl. `isSuperAdmin` + `permissions[]`.
- `Root.jsx` → renders `App.jsx` (single `AppLayout`) for all logged-in users. **This is the split point.**
- **Attendance already supports two punch methods**: `punchType: ["qr","selfie"]` on the model;
  selfie punch (`SelfiePunchIn.jsx` + `useMarkSelfieAttendance`) already captures **selfie + geolocation**.
  Method is currently chosen by an **org-wide** setting `settings.attendancePunchType` (`qr|selfie|both`).
  The ask is to make it **per-employee, manager-controlled**.
- `/attendance/list` **auto-scopes to the logged-in employee** when they only have `attendance.readOwn`
  (employee preset) — so employee self-views can reuse existing list/balance endpoints directly.
- Timestamps across the app are in **seconds** (`fromDateInput` divides by 1000; `toMs` multiplies if <1e10).
- Many requested features already have working backend + components:
  - Leaves: `ApplyLeaveForm`, `useLeave`, `useLeaveBalance`, leave policies (admin defines types).
  - Reimbursement = **Expenses** module (employee preset has `expense.create`/`expense.read`).
  - Announcements / Holidays / Documents: read endpoints in employee preset.
  - Profile edit: `employee.updateOwn` permission + `/employee/update` (self allowed).
- Net-new (no backend yet): **Set Alarm**, **Notes**, **CRM**, per-employee punch method, attendance calendar self-view.

## Work breakdown

### Phase 1 — Portal foundation  ✅ DONE
- [x] `client/src/utils/roles.js` — `isAdmin(user)`, `isEmployeeOnly(user)`, `resolvePunchType(user, orgSetting)`.
- [x] `client/src/utils/constants.jsx` — added `ROUTES.EMPLOYEE.*`.
- [x] `client/src/components/layouts/EmployeeLayout.jsx` — restricted nav shell (Me / Workplace / Tools groups).
- [x] `client/src/routes/EmployeeApp.jsx` + `App.jsx` — renders Employee Portal when `!isAdmin(user)`, else admin app.

### Phase 2 — Core employee pages  ✅ DONE
- [x] `pages/employee/EmployeeDashboard.jsx` — greeting, today's punch status, leave balance, quick tiles.
- [x] `pages/employee/MyAttendance.jsx` — **month calendar**, color-coded (green=present, red=absent,
      amber=half-day, fuchsia=leave, gray=week-off, sky=holiday); month switcher + summary counts + legend (matches screenshot).
- [x] `pages/employee/MyProfile.jsx` — view + edit own (name/mobile/photo/bank/ifsc) via `/employee/update`; updates redux.
- [x] `pages/employee/MyLeaves.jsx` — apply leave (types from `LeaveTypeDropdown` = admin/manager policies), history + status, balances.

### Phase 3 — Reuse existing modules inside portal  ✅ DONE
- [x] Announcements (read feed), Holidays (read list), Documents (read/download) — dedicated employee pages, no admin actions.
- [x] Reimbursement — employee view of Expenses: own history + "Request" drawer (`API.expense.create` with `employee: user._id`).

### Phase 4 — Per-employee punch method (manager-controlled)  ✅ DONE
- [x] Backend: `attendancePunchType: {enum:["qr","selfie",null], default null}` on `Employee`;
      accepted in `employee/create.js` + `employee/update.js` (+ Joi).
- [x] Frontend: `MarkAttendance.jsx` uses `resolvePunchType(user, settings?.attendancePunchType)` (per-employee wins, else org).
- [x] `AddEmployeeForm.jsx` — punch-method selector (Org Default / QR / Selfie) threaded through `useAddEmployee`.
      Photo upload was **already present** in the form (`FileUpload`) — requirement already satisfied.

### Phase 5 — Net-new features  ✅ partial (client-only)
- [x] Set Alarm — `pages/employee/Alarm.jsx`: localStorage alarms + Notification API, fires while app open (1-min tick).
- [x] Notes — `pages/employee/Notes.jsx`: localStorage personal notes (per user/device).
- [~] CRM — placeholder page (`Crm.jsx`). **NEEDS SCOPING** before real build.

### Phase 6 — Remaining / follow-ups  ⬜ PENDING
- [ ] Employee **edit** form: surface `attendancePunchType` + photo on the existing employee update drawer (so a manager
      can change an existing employee's method, not just at creation). Find/extend the update form used by `Employees`/`Employee` pages.
- [ ] Notes & Alarm server-side persistence (recommend `Note` + `Alarm` org-scoped models via the makeCrud module pattern)
      so data follows the user across devices; wire Alarm to FCM push (firebase already configured) for background reminders.
- [ ] CRM module — build once scoped (likely a Lead/Contact model + pipeline board following the module pattern).
- [ ] Manager view: approve/reject for direct reports (leave & reimbursement) inside the portal for `employeeManager` preset.
- [ ] Re-login note: `attendancePunchType` only appears on `state.user` after the employee logs in again
      (added after their session started) — falls back to org setting until then. Acceptable.

## Decisions / open questions for the user
- CRM scope is undefined — confirm what "CRM" should contain before building.
- Notes: persist server-side (recommended) or local only?
- Alarm: in-app only, or push via existing FCM/firebase messaging already wired in the app?

## Testing with seed data
`yarn seed` (or `node server/seed.js`) creates 3 demo orgs × 108 people; password for all = `password123`.
It now sets per-employee `attendancePunchType` (rotates selfie/qr/null across staff) and prints example logins:
**Staff · selfie** (selfie+location punch only), **Staff · QR** (QR-only), plus admin/HR/finance logins.
Log in as a "Staff" account to see the **Employee Portal**; admins/HR get the full admin app.

## Bugs fixed (pre-existing, surfaced during testing)
- **rbac super-admin crash** — `server/middlewares/rbac.js` bypassed RBAC for super admins via `next()` but
  never set `req.user.matchedPermissions`. Every controller that branches on it (`employee/list`,
  `attendance/list`, `leave/list`, `payroll/list`, …) then threw `Cannot read properties of undefined (reading 'includes')`
  for super-admin logins — showing a red "..." toast. Fixed: super admins now get `permissionsPresets.superadmin`
  as `matchedPermissions`. Verified `/employee/list` → 200 success.

- **Payroll/Department blank screen** — `pages/app/Payroll.jsx` (and `Department.jsx`) used `<Pagination>`
  without importing it from `flowbite-react`. `Pagination` only renders when `totalPages > 1`, so it stayed
  hidden until the seed produced enough rows (108 payrolls) — then `ReferenceError: Pagination is not defined`
  crashed the whole page (no error boundary → blank). Fixed both imports. `Attendance.jsx`/`Employees.jsx` already imported it.

- **Employee portal white screen (leave balance)** — `/leave/balance` returns the employee **document**
  (`{ _id, leaveBalances: [...] }`), not a bare array. `useLeaveBalance` stored that object, so
  `leaveBalances.reduce(...)` in `EmployeeDashboard` (and `.map` in `MyLeaves`) threw and unmounted the portal.
  Fixed the hook to extract `leaves?.leaveBalances`.
- **`/organization/settings` 403/null for employees** — route was missing from the rbac `permissionsMap`, so
  for non-super-admins rbac ran `undefined.filter(...)` → threw → endpoint returned null → `useOrgSettings`
  crashed on `null.success`. Fixed: added `organization/settings` (`"*"`) + `updateSettings` to the map,
  made rbac deny cleanly (403) on any unmapped route instead of crashing, and null-guarded `useOrgSettings`.

## Notes for whoever resumes
- Pre-existing bug spotted (still open, not yet hit): `server/controllers/employee/update.js` references
  `organization` that isn't in scope inside the `if (manager)` block — will ReferenceError if a manager is changed.
- Follow the established module pattern documented in project memory (`makeCrud`, rbac map entry per route, etc.).
- Verify client with `yarn build`; backend route import smoke test per memory.
