import { errorStrings } from "../utils/constants.js";
import { handleError } from "../utils/handlers.js";
import { getURLInitials } from "../utils/index.js";
import permissions from "../utils/permissions.js";

const rbac = async (req, res, next) => {
  try {
    const key = getURLInitials(req.originalUrl);
    const grantedPermissions = req.user.permissions;

    const requiredPermissions = permissionsMap[key];
    console.log({ key, requiredPermissions });
    if (requiredPermissions && requiredPermissions === "*") {
      next();
      return;
    }
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
  "/api/v1/attendance/mark": [permissions.attendance.create],
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
  "/api/v1/media/upload": [permissions.media.create],
  "/api/v1/financialYear/list": [permissions.financialYear.read],
  "/api/v1/ctc/create": [permissions.ctc.create],
  "/api/v1/ctc/update": [permissions.ctc.update],
  "/api/v1/payroll/list": [permissions.payroll.read, permissions.payroll.readOwn],
  "/api/v1/payroll/export": [permissions.payroll.read, permissions.payroll.readOwn],
  "/api/v1/payroll/updaate": [permissions.payroll.update],
  "/api/v1/payroll/paySlip": [permissions.payroll.read, permissions.payroll.readOwn],
  "/api/v1/fcm/add": "*",
  "/api/v1/permission/get": "*",
};
