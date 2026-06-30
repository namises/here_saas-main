// Role helpers — the app logs everyone in through the Employee collection.
// Admins are Employees with isSuperAdmin + the organizationAdmin permission preset
// (which includes `employee.create`). Regular employees get the `employee` preset
// (readOwn/updateOwn) and must see the restricted Employee Portal instead of the admin app.

// Admins/managers can read OTHER employees (`employee.read`) and/or create them (`employee.create`).
// Plain employees only have `employee.read.own`. So these markers separate "gets the admin dashboard"
// from "gets the employee portal" — managers count as admins here and land on the admin dashboard.
const ADMIN_MARKER_PERMISSIONS = ["employee.read", "employee.create"];

export const isAdmin = (user) => {
  if (!user) return false;
  if (user.isSuperAdmin) return true;
  return Array.isArray(user.permissions) && user.permissions.some((p) => ADMIN_MARKER_PERMISSIONS.includes(p));
};

// True for self-service-only users (plain employees — the `employee` preset, read-own only).
export const isEmployeeOnly = (user) => !!user && !isAdmin(user);

// Per-employee attendance punch method, falling back to the org-wide setting.
// Returns "qr" | "selfie" | "both".
export const resolvePunchType = (user, orgSetting) => {
  const own = user?.attendancePunchType;
  if (own === "qr" || own === "selfie") return own;
  return orgSetting ?? "qr";
};
