import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LuCalendarClock,
  LuUserRound,
  LuCalendarX2,
  LuMegaphone,
  LuCalendarDays,
  LuFileText,
  LuReceipt,
  LuStickyNote,
  LuAlarmClock,
  LuContact,
  LuArrowRight,
} from "react-icons/lu";
import { API } from "src/API/api";
import useLeaveBalance from "src/API/hooks/useLeaveBalance";
import { ROUTES } from "src/utils/constants";
import { toMs } from "src/utils/ui";

const TILES = [
  { label: "My Attendance", to: ROUTES.EMPLOYEE.ATTENDANCE, Icon: LuCalendarClock, accent: "#3b82f6" },
  { label: "Leaves", to: ROUTES.EMPLOYEE.LEAVES, Icon: LuCalendarX2, accent: "#ec4899" },
  { label: "My Profile", to: ROUTES.EMPLOYEE.PROFILE, Icon: LuUserRound, accent: "#6366f1" },
  { label: "Announcements", to: ROUTES.EMPLOYEE.ANNOUNCEMENTS, Icon: LuMegaphone, accent: "#f59e0b" },
  { label: "Holidays", to: ROUTES.EMPLOYEE.HOLIDAYS, Icon: LuCalendarDays, accent: "#10b981" },
  { label: "Documents", to: ROUTES.EMPLOYEE.DOCUMENTS, Icon: LuFileText, accent: "#0ea5e9" },
  { label: "Reimbursements", to: ROUTES.EMPLOYEE.REIMBURSEMENTS, Icon: LuReceipt, accent: "#ef4444" },
  { label: "Notes", to: ROUTES.EMPLOYEE.NOTES, Icon: LuStickyNote, accent: "#eab308" },
  { label: "Set Alarm", to: ROUTES.EMPLOYEE.ALARM, Icon: LuAlarmClock, accent: "#8b5cf6" },
  { label: "CRM", to: ROUTES.EMPLOYEE.CRM, Icon: LuContact, accent: "#14b8a6" },
];

const STATUS_PILL = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-red-100 text-red-700",
  "half-day": "bg-amber-100 text-amber-700",
  leave: "bg-fuchsia-100 text-fuchsia-700",
  holiday: "bg-sky-100 text-sky-700",
  week_off: "bg-gray-100 text-gray-600",
};

const fmtTime = (sec) => (sec ? new Date(toMs(sec)).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : "—");

const EmployeeDashboard = () => {
  const user = useSelector((s) => s.user);
  const { leaveBalances } = useLeaveBalance(user?._id);
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);

  useEffect(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    API.attendance
      .list({ startDate: Math.floor(start.getTime() / 1000), endDate: Math.floor(end.getTime() / 1000), limit: 5, page: 1 })
      .then((res) => setToday(res?.data?.attendance?.items?.[0] || null))
      .finally(() => setLoadingToday(false));
  }, []);

  const totalAvailable = useMemo(
    () => leaveBalances.reduce((sum, b) => sum + Math.max(0, (b.credited || 0) + (b.carryForwarded || 0) - (b.used || 0)), 0),
    [leaveBalances]
  );

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hi {user?.name?.split(" ")[0] || "there"} 👋</h1>
        <p className="text-sm text-gray-400">Your self-service workspace — punch in, track attendance, and manage leaves.</p>
      </div>

      {/* Today + leave summary */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800 sm:col-span-2">
          <p className="mb-3 text-sm font-semibold text-gray-500">Today</p>
          {loadingToday ? (
            <div className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
          ) : (
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_PILL[today?.status] || "bg-gray-100 text-gray-500"}`}>
                  {today?.status ? today.status.replace("_", " ") : "Not marked"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Check In</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{fmtTime(today?.checkIn)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Check Out</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{fmtTime(today?.checkOut)}</p>
              </div>
              <p className="text-xs text-gray-400">Use the punch button in the top bar to mark attendance.</p>
            </div>
          )}
        </div>
        <Link to={ROUTES.EMPLOYEE.LEAVES} className="group flex flex-col justify-between rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-4 text-white shadow-sm">
          <p className="text-sm font-medium opacity-90">Leave Balance</p>
          <p className="text-4xl font-bold">{totalAvailable}</p>
          <span className="flex items-center gap-1 text-xs opacity-90">
            Apply / view <LuArrowRight className="transition group-hover:translate-x-0.5" size="0.85rem" />
          </span>
        </Link>
      </div>

      {/* Quick tiles */}
      <p className="mb-3 text-sm font-semibold text-gray-500">Quick access</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {TILES.map((t) => (
          <Link key={t.label} to={t.to} className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${t.accent}1a`, color: t.accent }}>
              <t.Icon size="1.3rem" />
            </span>
            <span className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200">
              {t.label}
              <LuArrowRight className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" size="0.9rem" />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default EmployeeDashboard;
