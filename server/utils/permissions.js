const permissions = {
  department: {
    create: "department.create",
    update: "department.update",
    delete: "department.delete",
    read: "department.read",
  },
  employee: {
    create: "employee.create",
    update: "employee.update",
    updateOwn: "employee.update.own",
    read: "employee.read",
    readOwn: "employee.read.own",
  },
  hierarchy: {
    read: "hierarchy.read",
  },
  attendance: {
    device: {
      list: "attendance.device.list",
    },
    create: "attendance.create",
    read: "attendance.read",
    readOwn: "attendance.read.own",
    createRequest: "attendance.request.create",
    readRequests: "attendance.request.read",
    readRequestsOwn: "attendance.request.read.own",
    action: "attendance.request.action",
  },
  workDays: {
    read: "workDays.read",
    update: "workDays.update",
  },
  shift: {
    read: "shift.read",
    create: "shift.create",
    update: "shift.update",
    delete: "shift.delete",
  },
  holiday: {
    read: "holiday.read",
    create: "holiday.create",
    update: "holiday.update",
    delete: "holiday.delete",
  },
  leave: {
    policy: { create: "leave.policy.create", read: "leave.policy.read", update: "leave.policy.update" },
    balance: { read: "leave.balance.read", readOwn: "leave.balance.read.own" },
    create: "leave.create",
    read: "leave.read",
    readOwn: "leave.read.own",
    update: "leave.update",
    action: "leave.action",
  },
  media: {
    create: "media.create",
  },
  financialYear: {
    read: "finnacialyear.read",
  },
  ctc: {
    create: "ctc.create",
    update: "ctc.update",
    read: "ctc.read",
    readOwn: "ctc.read.own",
  },
  payroll: {
    read: "payroll.read",
    update: "payroll.update",
    readOwn: "payroll.read.own",
  },
  branch: { create: "branch.create", read: "branch.read", update: "branch.update", delete: "branch.delete" },
  asset: { create: "asset.create", read: "asset.read", update: "asset.update", delete: "asset.delete" },
  expense: { create: "expense.create", read: "expense.read", update: "expense.update", delete: "expense.delete" },
  announcement: { create: "announcement.create", read: "announcement.read", update: "announcement.update", delete: "announcement.delete" },
  recruitment: { create: "recruitment.create", read: "recruitment.read", update: "recruitment.update", delete: "recruitment.delete" },
  performance: { create: "performance.create", read: "performance.read", update: "performance.update", delete: "performance.delete" },
  document: { create: "document.create", read: "document.read", update: "document.update", delete: "document.delete" },
  approval: { create: "approval.create", read: "approval.read", update: "approval.update", delete: "approval.delete", action: "approval.action" },
  compliance: { create: "compliance.create", read: "compliance.read", update: "compliance.update", delete: "compliance.delete" },
  wps: { create: "wps.create", read: "wps.read", update: "wps.update", delete: "wps.delete", generate: "wps.generate" },
  biometric: { create: "biometric.create", read: "biometric.read", update: "biometric.update", delete: "biometric.delete" },
  analytics: { read: "analytics.read" },
};

export default permissions;
