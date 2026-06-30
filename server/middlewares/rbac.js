import { errorStrings } from "../utils/constants.js";
import { handleError } from "../utils/handlers.js";
import { getURLInitials } from "../utils/index.js";
import permissions from "../utils/permissions.js";
import permissionsPresets from "../utils/permissionsPresets.js";

const rbac = async (req, res, next) => {
  try {
    const grantedPermissions = req.user?.permissions || [];
    // Super admins AND admins/managers (anyone who can read other employees or create them) bypass
    // granular RBAC and get FULL access — same as the super-admin bypass. matchedPermissions is set to
    // the full set so downstream controllers branching on it (employee/attendance/leave list) work.
    // Plain employees (employee.read.own only) fall through to granular RBAC below.
    const isAdminUser = req.user?.isSuperAdmin || grantedPermissions.includes("employee.read") || grantedPermissions.includes("employee.create");
    if (isAdminUser) {
      req.user.matchedPermissions = permissionsPresets.superadmin;
      next();
      return;
    }
    const key = getURLInitials(req.originalUrl);

    const requiredPermissions = permissionsMap[key];
    console.log({ key, requiredPermissions });
    if (requiredPermissions === "*") {
      next();
      return;
    }
    // No mapping for this route → deny cleanly instead of crashing on `.filter` of undefined.
    if (!requiredPermissions) throw new Error(errorStrings.notPermitted);
    const matchedPermissions = requiredPermissions.filter((p) => grantedPermissions.includes(p));

    console.log({ matchedPermissions, grantedPermissions });
    if (!matchedPermissions.length) throw new Error(errorStrings.notPermitted);
    req.user.matchedPermissions = matchedPermissions;
    next();
  } catch (error) {
    return handleError(res, error);
  }
};

export default rbac;

const permissionsMap = {
  "/api/v1/department/create": [permissions.department.create],
  "/api/v1/department/update": [permissions.department.update],
  "/api/v1/department/delete": [permissions.department.delete],
  "/api/v1/department/list": [permissions.department.read],
  "/api/v1/employee/create": [permissions.employee.create],
  "/api/v1/employee/update": [permissions.employee.update, permissions.employee.updateOwn],
  "/api/v1/employee/list": [permissions.employee.read, permissions.employee.readOwn],
  "/api/v1/employee/get": [permissions.employee.read, permissions.employee.readOwn],
  "/api/v1/hierarchy/view": [permissions.hierarchy.read],
  // Punch endpoints only ever mark the logged-in employee's OWN attendance (req.user.employee),
  // so any authenticated user may call them — incl. self-service employees who lack attendance.create.
  "/api/v1/attendance/mark": "*",
  "/api/v1/attendance/markSelfie": "*",
  "/api/v1/attendance/request": [permissions.attendance.createRequest],
  "/api/v1/attendance/approve": [permissions.attendance.action],
  "/api/v1/attendance/reject": [permissions.attendance.action],
  "/api/v1/attendance/list": [permissions.attendance.read, permissions.attendance.readOwn],
  "/api/v1/attendance/export": [permissions.attendance.read, permissions.attendance.readOwn],
  "/api/v1/attendance/listRequests": [permissions.attendance.readRequests],
  "/api/v1/attendance/listDevice": [permissions.attendance.device.list],
  "/api/v1/workDays/update": [permissions.workDays.update],
  "/api/v1/workDays/get": [permissions.workDays.read],
  "/api/v1/shift/list": [permissions.shift.read],
  "/api/v1/shift/create": [permissions.shift.create],
  "/api/v1/shift/update": [permissions.shift.update],
  "/api/v1/shift/delete": [permissions.shift.delete],
  "/api/v1/holiday/list": [permissions.holiday.read],
  "/api/v1/holiday/create": [permissions.holiday.create],
  "/api/v1/holiday/update": [permissions.holiday.update],
  "/api/v1/holiday/delete": [permissions.holiday.delete],
  "/api/v1/leave/policy/create": [permissions.leave.policy.create],
  "/api/v1/leave/policy/update": [permissions.leave.policy.update],
  "/api/v1/leave/policy/list": [permissions.leave.policy.read],
  "/api/v1/leave/request": [permissions.leave.create],
  "/api/v1/leave/update": [permissions.leave.update],
  "/api/v1/leave/approve": [permissions.leave.action],
  "/api/v1/leave/reject": [permissions.leave.action],
  "/api/v1/leave/list": [permissions.leave.read, permissions.leave.readOwn],
  "/api/v1/leave/balance": [permissions.leave.balance.read, permissions.leave.balance.readOwn],
  // Any authenticated user may upload media (profile photo, own documents). Size/MIME limited + login-gated.
  "/api/v1/media/upload": "*",
  "/api/v1/financialYear/list": [permissions.financialYear.read],
  "/api/v1/ctc/create": [permissions.ctc.create],
  "/api/v1/ctc/update": [permissions.ctc.update],
  "/api/v1/payroll/list": [permissions.payroll.read, permissions.payroll.readOwn],
  "/api/v1/payroll/export": [permissions.payroll.read, permissions.payroll.readOwn],
  "/api/v1/payroll/update": [permissions.payroll.update],
  "/api/v1/payroll/generate": [permissions.payroll.update],
  "/api/v1/payroll/paySlip": [permissions.payroll.read, permissions.payroll.readOwn],
  "/api/v1/fcm/add": "*",
  "/api/v1/permission/get": "*",
  // Org settings: any authenticated user may read (e.g. attendance punch type); admins bypass rbac for updates.
  "/api/v1/organization/settings": "*",
  "/api/v1/organization/updateSettings": [permissions.workDays.update],

  // Multi-branch
  "/api/v1/branch/list": [permissions.branch.read],
  "/api/v1/branch/create": [permissions.branch.create],
  "/api/v1/branch/update": [permissions.branch.update],
  "/api/v1/branch/delete": [permissions.branch.delete],

  // Assets
  "/api/v1/asset/list": [permissions.asset.read],
  "/api/v1/asset/create": [permissions.asset.create],
  "/api/v1/asset/update": [permissions.asset.update],
  "/api/v1/asset/delete": [permissions.asset.delete],

  // Expenses
  "/api/v1/expense/list": [permissions.expense.read],
  "/api/v1/expense/create": [permissions.expense.create],
  "/api/v1/expense/update": [permissions.expense.update],
  "/api/v1/expense/delete": [permissions.expense.delete],

  // Announcements
  "/api/v1/announcement/list": [permissions.announcement.read],
  "/api/v1/announcement/create": [permissions.announcement.create],
  "/api/v1/announcement/update": [permissions.announcement.update],
  "/api/v1/announcement/delete": [permissions.announcement.delete],

  // Recruitment & ATS
  "/api/v1/job/list": [permissions.recruitment.read],
  "/api/v1/job/create": [permissions.recruitment.create],
  "/api/v1/job/update": [permissions.recruitment.update],
  "/api/v1/job/delete": [permissions.recruitment.delete],
  "/api/v1/candidate/list": [permissions.recruitment.read],
  "/api/v1/candidate/create": [permissions.recruitment.create],
  "/api/v1/candidate/update": [permissions.recruitment.update],
  "/api/v1/candidate/delete": [permissions.recruitment.delete],

  // Performance
  "/api/v1/performance/list": [permissions.performance.read],
  "/api/v1/performance/create": [permissions.performance.create],
  "/api/v1/performance/update": [permissions.performance.update],
  "/api/v1/performance/delete": [permissions.performance.delete],
  "/api/v1/goal/list": [permissions.performance.read],
  "/api/v1/goal/create": [permissions.performance.create],
  "/api/v1/goal/update": [permissions.performance.update],
  "/api/v1/goal/delete": [permissions.performance.delete],

  // Documents
  "/api/v1/document/list": [permissions.document.read],
  "/api/v1/document/create": [permissions.document.create],
  "/api/v1/document/update": [permissions.document.update],
  "/api/v1/document/delete": [permissions.document.delete],

  // Approval workflows
  "/api/v1/approval/list": [permissions.approval.read],
  "/api/v1/approval/create": [permissions.approval.create],
  "/api/v1/approval/update": [permissions.approval.update],
  "/api/v1/approval/delete": [permissions.approval.delete],
  "/api/v1/approval/act": [permissions.approval.action],

  // UAE Compliance
  "/api/v1/compliance/list": [permissions.compliance.read],
  "/api/v1/compliance/create": [permissions.compliance.create],
  "/api/v1/compliance/update": [permissions.compliance.update],
  "/api/v1/compliance/delete": [permissions.compliance.delete],
  "/api/v1/compliance/stats": [permissions.compliance.read],

  // WPS payroll compliance
  "/api/v1/wps/list": [permissions.wps.read],
  "/api/v1/wps/create": [permissions.wps.create],
  "/api/v1/wps/update": [permissions.wps.update],
  "/api/v1/wps/delete": [permissions.wps.delete],
  "/api/v1/wps/generate": [permissions.wps.generate],
  "/api/v1/wps/download": [permissions.wps.read],

  // Biometric devices
  "/api/v1/biometric/list": [permissions.biometric.read],
  "/api/v1/biometric/create": [permissions.biometric.create],
  "/api/v1/biometric/update": [permissions.biometric.update],
  "/api/v1/biometric/delete": [permissions.biometric.delete],

  // Analytics / reporting
  "/api/v1/analytics/overview": [permissions.analytics.read],
  "/api/v1/analytics/headcount": [permissions.analytics.read],
};
