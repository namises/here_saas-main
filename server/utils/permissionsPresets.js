import permissions from "./permissions.js";

const permissionsPresets = {
  employee: [
    //
    permissions.employee.readOwn,
    permissions.employee.updateOwn,
    permissions.attendance.readOwn,
    permissions.attendance.createRequest,
    permissions.attendance.readRequestsOwn,
    permissions.leave.readOwn,
    permissions.leave.create,
    permissions.leave.update,
    permissions.leave.balance.readOwn,
    permissions.ctc.readOwn,
    permissions.payroll.readOwn,
    permissions.holiday.read,
    permissions.workDays.read,
  ],

  employeeManager: [
    //
    permissions.employee.read,
    permissions.employee.update,
    permissions.attendance.read,
    permissions.attendance.readRequests,
    permissions.attendance.action,
    permissions.leave.create,
    permissions.leave.read,
    permissions.leave.update,
    permissions.leave.action,
    permissions.leave.balance.readOwn,
    permissions.leave.balance.read,
    permissions.shift.read,
    permissions.holiday.read,
    permissions.workDays.read,
    permissions.department.read,
  ],

  organizationAdmin: [
    // Employee Management
    permissions.employee.create,
    permissions.employee.read,
    permissions.employee.update,

    // Department & Hierarchy
    permissions.department.create,
    permissions.department.update,
    permissions.department.delete,
    permissions.department.read,
    permissions.hierarchy.read,

    // Attendance
    permissions.attendance.device.list,
    permissions.attendance.create,
    permissions.attendance.read,
    permissions.attendance.createRequest,
    permissions.attendance.readRequests,
    permissions.attendance.action,

    // Shift, Workdays, Holidays
    permissions.shift.create,
    permissions.shift.read,
    permissions.shift.update,
    permissions.shift.delete,
    permissions.workDays.read,
    permissions.workDays.update,
    permissions.holiday.create,
    permissions.holiday.read,
    permissions.holiday.update,
    permissions.holiday.delete,

    // Leave
    permissions.leave.policy.create,
    permissions.leave.policy.read,
    permissions.leave.policy.update,
    permissions.leave.create,
    permissions.leave.read,
    permissions.leave.update,
    permissions.leave.action,
    permissions.leave.balance.readOwn,
    permissions.leave.balance.read,

    // Media
    permissions.media.create,

    // Financial Year
    permissions.financialYear.read,

    // CTC
    permissions.ctc.create,
    permissions.ctc.read,
    permissions.ctc.update,

    // Payroll
    permissions.payroll.read,
    permissions.payroll.update,
  ],

  superadmin: [
    // All permissions
    ...Object.values(permissions).flatMap((section) => (typeof section === "object" ? Object.values(section).flatMap((s) => (typeof s === "object" ? Object.values(s) : s)) : section)),
  ],
};

export default permissionsPresets;
