# Employee Self-Service Portal — Handoff

> Living progress file. **Resume from Phase 6 (Remaining / follow-ups) — Phases 1–5 are built & build-verified.**
> Legend: `[x] DONE` · `[~] ACTIVE` (in progress, may be partial) · `[ ] PENDING`
> Last updated: 2026-06-28
>
> **Status:** Employee Portal foundation + core pages shipped and `yarn build` passes. Not yet manually
> run against a live employee login — verify by logging in as a non-admin employee (created via Add Employee).
>
> **ROUND 2 IN PROGRESS (2026-06-28):** profile/documents/roles overhaul — see "Round 2 roadmap" below.

## Round 2 roadmap — Profile / Documents / Roles overhaul
Big multi-part request (2026-06-28). Foundation done; large UI + role-scoping pending.

### Done this round (build-verified)
- [x] **Working days editable** — `WorkDays.jsx` was display-only; now tap-to-toggle + Save (wired in `Calendar.jsx`
      via the hook's existing `setWorkDay`/`updateWorkDays`). Backend `/workDays/update` was always fine.
- [x] **Super admin doesn't punch** — `AppLayout.jsx` hides `<MarkAttendance />` when `user.isSuperAdmin`.
- [x] **Employee model expanded** (`server/db/Employee.js`): personal (gender, bloodGroup, maritalStatus),
      contact (personalEmail, alternateMobile, address), work (dateOfJoining, probationPeriodMonths, probationStatus,
      employeeType, workLocation, workExperienceYears, billingStatus), work-info (jobTitle, subDepartment,
      `workHistory[]` = {department,designation,from,to}), `resignation{}`. `DocumentSchema` now has `_id`,
      `category`, `uploadedBy`, `uploadedByRole`, `createdAt`.
- [x] **`employee/update.js`**: accepts all new fields; **self-edits are whitelisted** to personal fields only
      (employees can't escalate permissions/status/etc.); employees are **append-only on documents** (can't
      delete/modify existing); admins (`employee.update`) get full control. Fixed the pre-existing `organization`
      ReferenceError in the manager block.
- [x] **`API.employee.update`** now passes the full payload through (no per-field enumeration).

### Pending (the big remaining work)
- [x] **A. Expanded profile UI** — DONE. `components/EmployeeProfileSections.jsx` (read view: Personal · Contact ·
      Work · Work Info · Work History table · Resignation) + `components/EmployeeProfileEdit.jsx` (full admin edit form).
      Wired into employee `MyProfile.jsx` (sectioned view + self-edit of personal fields + photo) and the admin
      `pages/app/Employee.jsx` Profile tab (ProfileImageUpload that saves the photo immediately + "Edit details" →
      full edit incl. **attendancePunchType**, which also covers most of item F's per-employee punch-method ask).
      Add/Edit Employee *forms* still capture only the basics → item G.
- [~] **B. Profile image upload** — DONE for employee `MyProfile`: new `components/ProfileImageUpload.jsx`
      gives **Camera** + **device file upload** (any image format) via `API.media.upload`; camera capture is
      converted to a `File` with `DataTransfer`. Photo persists on "Save changes". STILL TODO: use the same
      component in Add/Edit Employee forms (they currently use device-only `FileUpload.jsx`, no camera).
- [ ] **C. Documents = employee documents** — the employee **Documents** portal page must show the employee's
      OWN `Employee.documents` (Aadhaar/PAN/etc.), allow **upload (append)** but **no delete/edit**. Admin manages
      (add/edit/delete) the same docs from the employee-detail view. (Add Employee already uploads docs at creation.)
      NOTE: the current `pages/employee/Documents.jsx` shows **company** documents — repurpose or split.
- [x] **D (revised). Admins/managers get the ADMIN dashboard, not the employee portal.** Per user (2026-06-28):
      "for admins I want the super-admin-type dashboard, not employee type." `isAdmin()` now also treats anyone with
      `employee.read` (managers) as admin → they land on `AppLayout`/admin dashboard. Only plain employees
      (`employee.read.own` only) get the employee portal.
- [x] **Admins = FULL access like super admin** (user decision 2026-06-28: "make admins full access like superadmin").
      `server/middlewares/rbac.js` now bypasses granular RBAC for ANY admin/manager (`isSuperAdmin` OR has
      `employee.read`/`employee.create`), setting `matchedPermissions = permissionsPresets.superadmin` — same as the
      super-admin bypass. Migration-free (works off the token's permissions). Verified a manager w/o `analytics.read`
      now gets 200 on `/analytics/overview`. **This SUPERSEDES the earlier team-scoping idea (item E) — all admins
      see all org data now.** Plain employees still go through granular RBAC.
- [~] **E. Team-scoping — DROPPED per user.** User chose "make admins full access like superadmin" (2026-06-28),
      so admins now see all org data (rbac bypass above). Keep this note only in case the requirement flips back.
- [ ] **F. Admin manages team attendance** — view/edit team members' attendance & profiles; change any team
      member's `attendancePunchType` (type one/two) anytime. The admin's OWN attendance requests are approved by
      the super admin.
- [ ] **G. Add/Edit Employee forms** updated to capture the full expanded field set (currently only the basics).

### Notes / decisions for Round 2
- Per-employee punch method already exists end-to-end (Round 1) — item F just needs an admin UI to set it on any team member.
- Team membership = `Hierarchy.reportsTo` chain (already seeded: staff → dept manager → super admin).
- These pieces share core files (profile components, `api.jsx`, Employee model) so they DON'T cleanly parallelize
  across agents without conflicts — recommend sequential pushes (foundation is now in place).

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

## Testing with seed data (rewritten 2026-06-29)
`yarn seed` (or `node server/seed.js`) **WIPES the entire DB**, then creates **2 orgs** (Acme `acme.ae`,
Globex `globex.ae`). Each org = **2 admins** (super-admin owner + admin) + **2 employees per admin** (4 emps/org),
plus department/shift/workdays/CTC/attendance/leave-balances/holidays. Password for all = `password123`.
Logins per org: `superadmin@<domain>` (owner, manages emp1+emp2), `admin@<domain>` (manages emp3+emp4),
`emp1..4@<domain>`. Admins → admin dashboard; `emp*` → employee portal. CTC + attendance are seeded so the
manual Payroll generate + attendance calendar have data.

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

- **Employees couldn't punch ("not permitted")** — `/attendance/markSelfie` was never in the rbac map, and
  `/attendance/mark` required `attendance.create` which the `employee` preset doesn't have. Both mark controllers
  are **self-only** (they punch `req.user.employee`), so both are now mapped to `"*"` (any authenticated user may
  mark their OWN attendance). Verified an employee token now passes rbac on markSelfie. NOTE: the selfie controller
  still gates on the **org-wide** `attendancePunchType` (must be selfie/both) — not the per-employee value; revisit
  if you want strict per-employee enforcement server-side.

- **"Invalid cloud_name here" on punch/upload** — `.env` has the placeholder `CLOUDINARY_CLOUD_NAME=here`, so every
  image upload (selfie punch + profile photo + docs) failed. Added `server/utils/mediaStorage.js`: uses Cloudinary
  when real creds are set, otherwise stores files under `server/uploads/` and serves them via `app.use("/uploads", ...)`.
  Wired into `attendance/markSelfie.js` and `media/upload.js`. Relaxed `FILE_URL_REGEX` to allow `http(s)` so local
  URLs validate. `server/uploads/` is gitignored. **To use real Cloudinary, just set the `CLOUDINARY_*` vars in `.env`.**

- **Employees couldn't upload (photo/docs) — "not permitted"** — `/media/upload` required `media.create` (org-admin
  only). Mapped it to `"*"` in rbac (any authenticated user; it's already MIME/size-limited). Employee `MyProfile`
  photo upload now persists immediately + updates redux so the top-right avatar refreshes instantly.

- **Admin "server error" editing an employee** — `EmployeeProfileEdit` sent `pan:""` for employees with no PAN,
  failing Joi `.length(10)`; and `middlewares/validator.js` returned validation errors WITHOUT a top-level `message`
  (client reads `data.message` → showed generic "server error"). Fixed: form omits empty fields; validator now
  includes `message` = first Joi detail. Verified admin update succeeds; bad input now returns a clear message.

- **Leave approve/reject was owner-locked** — only the assigned `owner` could act (backend threw "You cannot
  approve/reject this leave"; UI hid the buttons). Now super admins/admins (`employee.read`) can act on ANY pending
  leave (backend `approve.js`/`reject.js` + `LeaveApplicationTableView`/`CardView` show buttons via `canAct`).
  Verified a super admin approving a non-owned leave returns success.
- **Admin top-right avatar** — `AppLayout` used a hard-coded placeholder; now uses `user?.photo` (like EmployeeLayout).

## Leaves in Approvals + approver badge (built 2026-06-29)
- Approvals page (`pages/app/Approvals.jsx`) is now tabbed: "Workflow Requests" (existing ApprovalRequest) +
  "Leaves" (`components/LeavesApprovalPanel.jsx` — real LeaveRequests with approve/reject).
- Leave now records WHO actioned it: `LeaveRequest.approvedBy` + `actionedAt`, set in `leave/approve.js`+`reject.js`,
  populated in `leave/list.js`. Panel shows a green "Approved by NAME" / red "Rejected by NAME" badge.

## Resignation flow (built 2026-06-29)
- Employee: `MyProfile` → "Apply for resignation" (last working day, notice days, reason) → `employee/update`
  with `resignation` → backend forces `status:"submitted"` for self-edits (employees can submit/withdraw, not approve).
- Admin: employee detail → Edit details → "Resignation" group (status/dates/reason/notice). Setting status
  Approved/Completed also sets employee `status:"resigned"`.

## Notes for whoever resumes
- Pre-existing bug spotted (still open, not yet hit): `server/controllers/employee/update.js` references
  `organization` that isn't in scope inside the `if (manager)` block — will ReferenceError if a manager is changed.
- Follow the established module pattern documented in project memory (`makeCrud`, rbac map entry per route, etc.).
- Verify client with `yarn build`; backend route import smoke test per memory.
