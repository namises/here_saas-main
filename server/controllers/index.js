import login from "./auth/login.js";
import register from "./auth/register.js";
import loginDevice from "./auth/loginDevice.js";
import createDepartment from "./department/create.js";
import updateDepartment from "./department/update.js";
import listDepartment from "./department/list.js";
import createEmployee from "./employee/create.js";
import updateEmployee from "./employee/update.js";
import listEmployees from "./employee/list.js";
import getEmployee from "./employee/get.js";
import viewHierarchy from "./hierarchy/view.js";
import markAttendance from "./attendance/mark.js";
import markSelfieAttendance from "./attendance/markSelfie.js";
import approveAttendance from "./attendance/approve.js";
import rejectAttendance from "./attendance/reject.js";
import requestAttendance from "./attendance/request.js";
import listAttendance from "./attendance/list.js";
import exportAttendance from "./attendance/export.js";
import listAttendanceDevice from "./attendance/listDevice.js";
import createLeavePolicy from "./leave/createPolicy.js";
import updateLeavePolicy from "./leave/updatePolicy.js";
import listLeavePolicy from "./leave/listPolicy.js";
import requestLeave from "./leave/request.js";
import approveLeave from "./leave/approve.js";
import rejectLeave from "./leave/reject.js";
import updateLeave from "./leave/update.js";
import listLeave from "./leave/list.js";
import listFinancialYear from "./financialYear/list.js";
import createCTC from "./ctc/create.js";
import updateCTC from "./ctc/update.js";
import listCTC from "./ctc/list.js";
import listPayroll from "./payroll/list.js";
import updatePayroll from "./payroll/update.js";
import generatePayroll from "./payroll/generate.js";
import createShift from "./shift/create.js";
import listShift from "./shift/list.js";
import updateShift from "./shift/update.js";
import deleteShift from "./shift/delete.js";
import createHoliday from "./holiday/create.js";
import listHoliday from "./holiday/list.js";
import updateHoliday from "./holiday/update.js";
import deleteHoliday from "./holiday/delete.js";
import getWorkDays from "./workDays/get.js";
import updateWorkDays from "./workDays/update.js";
import listAttendanceRequests from "./attendance/listRequests.js";
import upload from "./media/upload.js";
import paySlip from "./payroll/paySlip.js";
import exportPayroll from "./payroll/export.js";
import getLeaveBalance from "./leave/balance.js";
import addToken from "./fcm/add.js";
import getPermission from "./permission/get.js";
import getOrgSettings from "./organization/getSettings.js";
import updateOrgSettings from "./organization/updateSettings.js";

// New modules
import branch from "./branch/index.js";
import asset from "./asset/index.js";
import expense from "./expense/index.js";
import announcement from "./announcement/index.js";
import job from "./job/index.js";
import candidate from "./candidate/index.js";
import performance from "./performance/index.js";
import goal from "./goal/index.js";
import companyDocument from "./document/index.js";
import approval from "./approval/index.js";
import compliance from "./compliance/index.js";
import wps from "./wps/index.js";
import biometric from "./biometric/index.js";
import analytics from "./analytics/index.js";

const controllers = {
  auth: { login, register, loginDevice },
  department: {
    create: createDepartment,
    update: updateDepartment,
    list: listDepartment,
  },
  employee: {
    create: createEmployee,
    update: updateEmployee,
    list: listEmployees,
    get: getEmployee,
  },
  hierarchy: {
    view: viewHierarchy,
  },
  attendance: {
    mark: markAttendance,
    markSelfie: markSelfieAttendance,
    approve: approveAttendance,
    reject: rejectAttendance,
    request: requestAttendance,
    list: listAttendance,
    listDevice: listAttendanceDevice,
    export: exportAttendance,
    listRequests: listAttendanceRequests,
  },
  leave: {
    policy: {
      create: createLeavePolicy,
      list: listLeavePolicy,
      update: updateLeavePolicy,
    },
    request: requestLeave,
    update: updateLeave,
    approve: approveLeave,
    reject: rejectLeave,
    list: listLeave,
    balance: getLeaveBalance,
  },
  financialYear: {
    list: listFinancialYear,
  },
  ctc: {
    create: createCTC,
    update: updateCTC,
    list: listCTC,
  },
  payroll: {
    list: listPayroll,
    update: updatePayroll,
    generate: generatePayroll,
    paySlip: paySlip,
    export: exportPayroll,
  },
  shift: {
    create: createShift,
    list: listShift,
    update: updateShift,
    delete: deleteShift,
  },
  holiday: {
    create: createHoliday,
    list: listHoliday,
    update: updateHoliday,
    delete: deleteHoliday,
  },
  workDays: {
    get: getWorkDays,
    update: updateWorkDays,
  },
  media: {
    upload,
  },
  fcm: {
    add: addToken,
  },
  permission: {
    get: getPermission,
  },
  organization: {
    getSettings: getOrgSettings,
    updateSettings: updateOrgSettings,
  },
  // New modules
  branch,
  asset,
  expense,
  announcement,
  job,
  candidate,
  performance,
  goal,
  companyDocument,
  approval,
  compliance,
  wps,
  biometric,
  analytics,
};

export default controllers;
