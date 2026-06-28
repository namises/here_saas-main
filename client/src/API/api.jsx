import { post, get, postMultipart } from "./apiService";
import { buildSearchQuery } from "src/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log({ API_BASE_URL });
const version = `/v1`;

export const endpoints = {
  auth: {
    register: `${API_BASE_URL}${version}/auth/register`,
    login: `${API_BASE_URL}${version}/auth/login`,
    loginDevice: `${API_BASE_URL}${version}/auth/loginDevice`,
  },
  department: {
    create: `${API_BASE_URL}${version}/department/create`,
    update: `${API_BASE_URL}${version}/department/update`,
    list: `${API_BASE_URL}${version}/department/list`,
  },
  employee: {
    create: `${API_BASE_URL}${version}/employee/create`,
    update: `${API_BASE_URL}${version}/employee/update`,
    list: `${API_BASE_URL}${version}/employee/list`,
    get: `${API_BASE_URL}${version}/employee/get`,
  },
  hierarchy: {
    view: `${API_BASE_URL}${version}/hierarchy/view`,
  },
  attendance: {
    listDevice: `${API_BASE_URL}${version}/attendance/listDevice`,
    listRequests: `${API_BASE_URL}${version}/attendance/listRequests`,
    mark: `${API_BASE_URL}${version}/attendance/mark`,
    markSelfie: `${API_BASE_URL}${version}/attendance/markSelfie`,
    request: `${API_BASE_URL}${version}/attendance/request`,
    approve: `${API_BASE_URL}${version}/attendance/approve`,
    reject: `${API_BASE_URL}${version}/attendance/reject`,
    list: `${API_BASE_URL}${version}/attendance/list`,
    export: `${API_BASE_URL}${version}/attendance/export`,
  },
  organization: {
    getSettings: `${API_BASE_URL}${version}/organization/settings`,
    updateSettings: `${API_BASE_URL}${version}/organization/updateSettings`,
  },
  leave: {
    policy: {
      create: `${API_BASE_URL}${version}/leave/policy/create`,
      update: `${API_BASE_URL}${version}/leave/policy/update`,
      list: `${API_BASE_URL}${version}/leave/policy/list`,
    },
    request: `${API_BASE_URL}${version}/leave/request`,
    update: `${API_BASE_URL}${version}/leave/update`,
    approve: `${API_BASE_URL}${version}/leave/approve`,
    reject: `${API_BASE_URL}${version}/leave/reject`,
    list: `${API_BASE_URL}${version}/leave/list`,
    balance: `${API_BASE_URL}${version}/leave/balance`,
  },
  financialYear: {
    list: `${API_BASE_URL}${version}/financialYear/list`,
  },
  ctc: {
    create: `${API_BASE_URL}${version}/ctc/create`,
    update: `${API_BASE_URL}${version}/ctc/update`,
    list: `${API_BASE_URL}${version}/ctc/list`,
  },
  payroll: {
    update: `${API_BASE_URL}${version}/payroll/update`,
    list: `${API_BASE_URL}${version}/payroll/list`,
    export: `${API_BASE_URL}${version}/payroll/export`,
    paySlip: `${API_BASE_URL}${version}/payroll/paySlip`,
  },
  workDays: {
    update: `${API_BASE_URL}${version}/workDays/update`,
    get: `${API_BASE_URL}${version}/workDays/get`,
  },
  shift: {
    create: `${API_BASE_URL}${version}/shift/create`,
    list: `${API_BASE_URL}${version}/shift/list`,
    update: `${API_BASE_URL}${version}/shift/update`,
    delete: `${API_BASE_URL}${version}/shift/delete`,
  },
  holiday: {
    create: `${API_BASE_URL}${version}/holiday/create`,
    list: `${API_BASE_URL}${version}/holiday/list`,
    update: `${API_BASE_URL}${version}/holiday/update`,
    delete: `${API_BASE_URL}${version}/holiday/delete`,
  },
  media: {
    upload: `${API_BASE_URL}${version}/media/upload`,
  },
  misc: {
    locale: `${API_BASE_URL}${version}/misc/locale`,
  },
  fcm: {
    add: `${API_BASE_URL}${version}/fcm/add`,
  },
  permission: {
    get: `${API_BASE_URL}${version}/permission/get`,
  },
  analytics: {
    overview: `${API_BASE_URL}${version}/analytics/overview`,
    headcount: `${API_BASE_URL}${version}/analytics/headcount`,
  },
  compliance: { stats: `${API_BASE_URL}${version}/compliance/stats` },
  wps: { generate: `${API_BASE_URL}${version}/wps/generate`, download: `${API_BASE_URL}${version}/wps/download` },
  approval: { act: `${API_BASE_URL}${version}/approval/act` },
};

// Base URL of a resource's list endpoint — used as the redux loading key.
export const resourceListUrl = (name) => `${API_BASE_URL}${version}/${name}/list`;

// Generic org-scoped CRUD client matching the backend crudController factory.
export const resourceApi = (name) => ({
  list: (params = {}) => get(`${API_BASE_URL}${version}/${name}/list${buildSearchQuery(params)}`),
  create: (body) => post(`${API_BASE_URL}${version}/${name}/create`, body),
  update: (body) => post(`${API_BASE_URL}${version}/${name}/update`, body),
  remove: ({ id }) => post(`${API_BASE_URL}${version}/${name}/delete`, { id }),
});

export const API = {
  auth: {
    register: ({ orgName, address, pan, domain, name, email, mobile, password }) => post(endpoints.auth.register, { orgName, address, pan, domain, name, email, mobile, password }),
    login: ({ email, password }) => post(endpoints.auth.login, { email, password }),
    loginDevice: ({ login, pass, org, id }) => post(endpoints.auth.loginDevice, { login, pass, org, id }),
  },
  department: {
    create: ({ name, code, description }) => post(endpoints.department.create, { name, code, description }),
    update: ({ departmentId, name, code, description }) => post(endpoints.department.update, { departmentId, name, code, description }),
    list: ({ page, limit, name, code, description }) => get(`${endpoints.department.list}${buildSearchQuery({ page, limit, name, code, description })}`),
  },
  employee: {
    create: ({ name, email, dob, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, attendancePunchType }) => post(endpoints.employee.create, { name, email, dob, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, attendancePunchType }),
    update: ({ employeeId, name, email, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, permissions, attendancePunchType }) => post(endpoints.employee.update, { employeeId, name, email, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, permissions, attendancePunchType }),
    list: ({ page, limit, employeeId, empCode, name, email, mobile, department, designation, manager, status }) => get(`${endpoints.employee.list}${buildSearchQuery({ page, limit, employeeId, empCode, name, email, mobile, department, designation, manager, status })}`),
    get: ({ employee }) => get(`${endpoints.employee.get}${buildSearchQuery({ employee })}`),
  },
  hierarchy: {
    view: ({ employeeId }) => get(`${endpoints.hierarchy.view}${buildSearchQuery({ employeeId })}`),
  },
  attendance: {
    listDevice: () => get(endpoints.attendance.listDevice),
    listRequests: () => get(endpoints.attendance.listRequests),
    mark: ({ code, lat, lng }) => post(endpoints.attendance.mark, { code, lat, lng }),
    markSelfie: ({ selfie, lat, lng }) => post(endpoints.attendance.markSelfie, { selfie, lat, lng }),
    request: ({ attendanceId, checkIn, checkOut, reason }) => post(endpoints.attendance.request, { attendanceId, checkIn, checkOut, reason }),
    approve: ({ attendanceRequestId, checkIn, checkOut, reason, status, comments }) => post(endpoints.attendance.approve, { attendanceRequestId, checkIn, checkOut, reason, status, comments }),
    reject: ({ attendanceRequestId, comments }) => post(endpoints.attendance.reject, { attendanceRequestId, comments }),
    list: ({ employee, startDate, endDate, status, requested, limit = 50, page = 1 }) => get(`${endpoints.attendance.list}${buildSearchQuery({ employee, startDate, endDate, status, requested, limit, page })}`),
    export: ({ employee, startDate, endDate, status, requested }) => get(`${endpoints.attendance.export}${buildSearchQuery({ employee, startDate, endDate, status, requested })}`, true),
  },
  leave: {
    policy: {
      create: ({ leaveType, code, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable }) => post(endpoints.leave.policy.create, { leaveType, code, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable }),
      update: ({ leavePolicyId, leaveType, code, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable }) => post(endpoints.leave.policy.update, { leavePolicyId, leaveType, code, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable }),
      list: ({ search, accrualFrequency, carryForward, encashable }) => get(`${endpoints.leave.policy.list}${buildSearchQuery({ search, accrualFrequency, carryForward, encashable })}`),
    },
    request: ({ leaveType, fromDate, toDate, reason }) => post(endpoints.leave.request, { leaveType, fromDate, toDate, reason }),
    update: ({ leaveId, leaveType, fromDate, toDate, reason }) => post(endpoints.leave.update, { leaveId, leaveType, fromDate, toDate, reason }),
    approve: ({ leaveId }) => post(endpoints.leave.approve, { leaveId }),
    reject: ({ leaveId }) => post(endpoints.leave.reject, { leaveId }),
    list: ({ employee, status, leaveType, limit = 10, page = 1 }) => get(`${endpoints.leave.list}${buildSearchQuery({ employee, status, leaveType, limit, page })}`),
    balance: ({ employee }) => get(`${endpoints.leave.balance}${buildSearchQuery({ employee })}`),
  },
  financialYear: {
    list: () => get(`${endpoints.financialYear.list}`),
  },
  ctc: {
    create: ({ employee, financialYear, earnings, deductions, remarks, effectiveFrom }) => post(endpoints.ctc.create, { employee, financialYear, earnings, deductions, remarks, effectiveFrom }),
    update: ({ ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom }) => post(endpoints.ctc.update, { ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom }),
    list: ({ page, limit, financialYear, employee }) => get(`${endpoints.ctc.list}${buildSearchQuery({ page, limit, financialYear, employee })}`),
  },
  payroll: {
    update: ({ payrollId, month, status, presentDays, totalWorkingDays, remarks, components }) => post(endpoints.payroll.update, { payrollId, month, status, presentDays, totalWorkingDays, remarks, components }),
    list: ({ page, limit, employee, month, status, financialYear }) => get(`${endpoints.payroll.list}${buildSearchQuery({ page, limit, employee, month, status, financialYear })}`),
    export: ({ employee, month, status, financialYear }) => get(`${endpoints.payroll.export}${buildSearchQuery({ employee, month, status, financialYear })}`, true),
    paySlip: ({ payrollId }) => get(`${endpoints.payroll.paySlip}${buildSearchQuery({ payrollId })}`, true),
  },
  workDays: {
    get: () => get(`${endpoints.workDays.get}`),
    update: ({ workDays }) => post(endpoints.workDays.update, { workDays }),
  },
  shift: {
    list: () => get(`${endpoints.shift.list}`),
    create: ({ name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration }) => post(endpoints.shift.create, { name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration }),
    update: ({ shiftId, name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration }) => post(endpoints.shift.update, { shiftId, name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration }),
    delete: ({ shiftId }) => post(endpoints.shift.delete, { shiftId }),
  },
  holiday: {
    list: ({ financialYear }) => get(`${endpoints.holiday.list}${buildSearchQuery({ financialYear })}`),
    create: ({ name, date, remarks }) => post(endpoints.holiday.create, { name, date, remarks }),
    update: ({ holidayId, name, date, remarks }) => post(endpoints.holiday.update, { holidayId, name, date, remarks }),
    delete: ({ holidayId }) => post(endpoints.holiday.delete, { holidayId }),
  },
  media: {
    upload: (body) => postMultipart(endpoints.media.upload, body),
  },
  misc: {
    locale: ({ ip }) => post(endpoints.misc.locale, { ip }),
  },
  fcm: {
    add: ({ fcmToken }) => post(endpoints.fcm.add, { fcmToken }),
  },
  permission: {
    get: () => get(endpoints.permission.get),
  },
  organization: {
    getSettings: () => get(endpoints.organization.getSettings),
    updateSettings: ({ attendancePunchType }) => post(endpoints.organization.updateSettings, { attendancePunchType }),
  },
  // New modules — generic CRUD
  branch: resourceApi("branch"),
  asset: resourceApi("asset"),
  expense: resourceApi("expense"),
  announcement: resourceApi("announcement"),
  job: resourceApi("job"),
  candidate: resourceApi("candidate"),
  performance: resourceApi("performance"),
  goal: resourceApi("goal"),
  document: resourceApi("document"),
  approval: { ...resourceApi("approval"), act: ({ id, decision, comments }) => post(endpoints.approval.act, { id, decision, comments }) },
  compliance: { ...resourceApi("compliance"), stats: () => get(endpoints.compliance.stats) },
  wps: {
    ...resourceApi("wps"),
    generate: ({ month, employerId, bankRoutingCode, financialYear }) => post(endpoints.wps.generate, { month, employerId, bankRoutingCode, financialYear }),
    download: ({ id }) => get(`${endpoints.wps.download}${buildSearchQuery({ id })}`),
  },
  biometric: resourceApi("biometric"),
  analytics: {
    overview: () => get(endpoints.analytics.overview),
    headcount: () => get(endpoints.analytics.headcount),
  },
};
