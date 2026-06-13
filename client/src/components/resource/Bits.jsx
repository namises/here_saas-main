import React from "react";
import { statusClass, titleCase } from "src/utils/ui";

export const PageHeader = ({ title, subtitle, Icon, accent = "#3b82f6", children }) => (
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm" style={{ background: `${accent}1a`, color: accent }}>
          <Icon size="1.5rem" />
        </span>
      )}
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
    {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
  </div>
);

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(status)}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {titleCase(status)}
  </span>
);

export const Segmented = ({ value, onChange, options }) => (
  <div className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-700/50">
    {options.map((o) => {
      const v = typeof o === "string" ? o : o.value;
      const label = typeof o === "string" ? titleCase(o) : o.label;
      const active = value === v;
      return (
        <button
          key={v ?? "all"}
          onClick={() => onChange(v)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${active ? "bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export const EmptyState = ({ Icon, title = "Nothing here yet", hint, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white/50 py-16 text-center dark:border-gray-700 dark:bg-gray-800/30">
    {Icon && <Icon className="text-gray-300 dark:text-gray-600" size="2.5rem" />}
    <div>
      <p className="font-medium text-gray-600 dark:text-gray-300">{title}</p>
      {hint && <p className="mt-1 text-sm text-gray-400">{hint}</p>}
    </div>
    {action}
  </div>
);

export const Avatar = ({ name = "?", size = 36 }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
  const color = colors[(name.charCodeAt(0) || 0) % colors.length];
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ width: size, height: size, background: color }}>
      {initials}
    </span>
  );
};
