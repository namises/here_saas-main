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
};

export default permissions;
