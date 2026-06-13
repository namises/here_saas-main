// Shared UI helpers for the new modules.

export const titleCase = (s = "") =>
  `${s}`
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

export const fmtMoney = (amount, currency = "AED") => {
  const n = Number(amount) || 0;
  return `${currency} ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export const toMs = (n) => (n && n < 1e10 ? n * 1000 : n);

export const fmtDate = (n) => {
  if (!n && n !== 0) return "—";
  const d = new Date(toMs(n));
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

export const fmtDateTime = (n) => {
  if (!n && n !== 0) return "—";
  const d = new Date(toMs(n));
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

export const toDateInput = (n) => {
  if (!n && n !== 0) return "";
  const d = new Date(toMs(n));
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

export const fromDateInput = (str) => (str ? Math.floor(new Date(str).getTime() / 1000) : null);

export const daysUntil = (n) => {
  if (!n && n !== 0) return null;
  return Math.ceil((toMs(n) - Date.now()) / (24 * 60 * 60 * 1000));
};

export const relativeTime = (n) => {
  const diff = Date.now() - toMs(n);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return fmtDate(Math.floor(toMs(n) / 1000));
};

// Tailwind classes per status value (covers all module statuses).
export const STATUS_STYLES = {
  // generic
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  reimbursed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  // assets
  available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  assigned: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  retired: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  // recruitment
  applied: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  screening: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  interview: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  offer: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  hired: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  // jobs
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "on-hold": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  closed: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  filled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  // compliance
  valid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "expiring-soon": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  expired: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "under-renewal": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  // devices / wps
  online: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  offline: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  draft: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  generated: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  submitted: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  // goals / reviews
  "not-started": "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  overdue: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "self-review": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "manager-review": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

export const statusClass = (s) => STATUS_STYLES[s] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
