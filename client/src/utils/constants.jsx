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
