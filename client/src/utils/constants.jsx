export const ROUTES = {
  APP: {
    HOME: "/",
    CALENDAR: "/calendar",
    DEPARTMENT: "/department",
    EMPLOYEES: "/employees",
    EMPLOYEE: "/employee/:id",
    ATTENDANCE: {
      ROOT: "/attendance",
      DEVICES: "/attendance/devices",
    },
    LEAVES: "/leaves",
    PAYROLL: "/payroll",
    HIERARCHY: "/hierarchy",
    SETTINGS: "/settings",
    ATTENDANCE_DEVICE_QR: "/attendanceDeviceQr",
    // New modules
    BRANCHES: "/branches",
    ASSETS: "/assets",
    EXPENSES: "/expenses",
    ANNOUNCEMENTS: "/announcements",
    RECRUITMENT: "/recruitment",
    PERFORMANCE: "/performance",
    DOCUMENTS: "/documents",
    APPROVALS: "/approvals",
    COMPLIANCE: "/compliance",
    WPS: "/wps",
    BIOMETRIC: "/biometric-devices",
    REPORTS: "/reports",
  },
  // Employee self-service portal (shown to non-admin employees)
  EMPLOYEE: {
    HOME: "/",
    ATTENDANCE: "/me/attendance",
    PROFILE: "/me/profile",
    LEAVES: "/me/leaves",
    ANNOUNCEMENTS: "/me/announcements",
    HOLIDAYS: "/me/holidays",
    DOCUMENTS: "/me/documents",
    REIMBURSEMENTS: "/me/reimbursements",
    NOTES: "/me/notes",
    ALARM: "/me/alarm",
    CRM: "/me/crm",
  },
  AUTH: {
    LOGIN: "/",
    REGISTER: "/register",
  },
};
export const rupee = "₹";
export const OTP_LENGTH = 6;
export const GENDER_OPTIONS = { Male: "M", Female: "F", Others: "O" };
export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const dateTypes = {
  EXACT: "exact",
  START: "start",
  END: "end",
};
