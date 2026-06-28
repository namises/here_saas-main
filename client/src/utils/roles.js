// Role helpers — the app logs everyone in through the Employee collection.
// Admins are Employees with isSuperAdmin + the organizationAdmin permission preset
// (which includes `employee.create`). Regular employees get the `employee` preset
// (readOwn/updateOwn) and must see the restricted Employee Portal instead of the admin app.

// `employee.create` is granted only to org admins/super admins — a reliable admin marker.
const ADMIN_MARKER_PERMISSION = "employee.create";

export const isAdmin = (user) => {
  if (!user) return false;
  if (user.isSuperAdmin) return true;
  return Array.isArray(user.permissions) && user.permissions.includes(ADMIN_MARKER_PERMISSION);
};

// True for self-service-only users (regular employees, including line managers
// who still lack org-admin capabilities).
export const isEmployeeOnly = (user) => !!user && !isAdmin(user);

// Per-employee attendance punch method, falling back to the org-wide setting.
// Returns "qr" | "selfie" | "both".
export const resolvePunchType = (user, orgSetting) => {
  const own = user?.attendancePunchType;
  if (own === "qr" || own === "selfie") return own;
  return orgSetting ?? "qr";
};
