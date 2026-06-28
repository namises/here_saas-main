import React, { useEffect, useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuInfo } from "react-icons/lu";
import { API } from "src/API/api";
import { toMs } from "src/utils/ui";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Status -> visual config. Mirrors the attendance enum on the backend.
const STATUS_CONFIG = {
  present: { label: "Present", cell: "bg-emerald-500 text-white", dot: "bg-emerald-500", tile: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  absent: { label: "Absent", cell: "bg-red-500 text-white", dot: "bg-red-500", tile: "bg-red-50 border-red-200 text-red-700" },
  "half-day": { label: "Half day", cell: "bg-amber-400 text-white", dot: "bg-amber-400", tile: "bg-amber-50 border-amber-200 text-amber-700" },
  leave: { label: "Paid Leave", cell: "bg-fuchsia-400 text-white", dot: "bg-fuchsia-400", tile: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700" },
  week_off: { label: "Week Off", cell: "bg-gray-300 text-gray-700", dot: "bg-gray-300", tile: "bg-gray-100 border-gray-200 text-gray-600" },
  holiday: { label: "Holiday", cell: "bg-sky-400 text-white", dot: "bg-sky-400", tile: "bg-sky-50 border-sky-200 text-sky-700" },
};

const dayKey = (y, m, d) => `${y}-${m}-${d}`;

const MyAttendance = () => {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() }); // month: 0-11
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const { monthStart, monthEnd } = useMemo(() => {
    const start = new Date(cursor.year, cursor.month, 1, 0, 0, 0);
    const end = new Date(cursor.year, cursor.month + 1, 0, 23, 59, 59); // last day of month
    return { monthStart: Math.floor(start.getTime() / 1000), monthEnd: Math.floor(end.getTime() / 1000) };
  }, [cursor]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    API.attendance
      .list({ startDate: monthStart, endDate: monthEnd, limit: 100, page: 1 })
      .then((res) => {
        if (!active) return;
        setRecords(res?.data?.attendance?.items || []);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [monthStart, monthEnd]);

  // Map each record to a per-day status keyed by Y-M-D (record.date is in seconds).
  const statusByDay = useMemo(() => {
    const map = {};
    for (const r of records) {
      if (!r?.date) continue;
      const d = new Date(toMs(r.date));
      map[dayKey(d.getFullYear(), d.getMonth(), d.getDate())] = r;
    }
    return map;
  }, [records]);

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, "half-day": 0, leave: 0, week_off: 0, holiday: 0 };
    for (const r of records) if (r?.status && c[r.status] != null) c[r.status] += 1;
    return c;
  }, [records]);

  // Build the calendar grid (leading blanks for the first weekday).
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isFuture = (d) => {
    const date = new Date(cursor.year, cursor.month, d);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date > t;
  };

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const goPrev = () => setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }));
  const goNext = () => setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }));

  const summary = [
    { key: "present", label: "Present", value: counts.present, bar: "border-l-emerald-500", chip: "text-emerald-600" },
    { key: "absent", label: "Absent", value: counts.absent, bar: "border-l-red-500", chip: "text-red-600" },
    { key: "half-day", label: "Half day", value: counts["half-day"], bar: "border-l-amber-400", chip: "text-amber-600" },
    { key: "leave", label: "Paid Leave", value: counts.leave, bar: "border-l-fuchsia-400", chip: "text-fuchsia-600" },
    { key: "week_off", label: "Week Off", value: counts.week_off, bar: "border-l-gray-400", chip: "text-gray-600" },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 dark:bg-amber-900/20">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
          <LuInfo size="1.2rem" />
          <span className="text-lg font-semibold">Attendance For</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 dark:border-amber-700 dark:bg-gray-800">
          <button onClick={goPrev} className="text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Previous month">
            <LuChevronLeft size="1.1rem" />
          </button>
          <span className="min-w-[110px] text-center text-sm font-semibold text-gray-700 dark:text-gray-200">{monthLabel}</span>
          <button onClick={goNext} className="text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Next month">
            <LuChevronRight size="1.1rem" />
          </button>
        </div>
      </div>

      {/* Summary counters */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {summary.map((s) => (
          <div key={s.key} className={`rounded-lg border-l-4 bg-white px-3 py-2.5 shadow-sm dark:bg-gray-800 ${s.bar}`}>
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold ${s.chip}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="mb-2 grid grid-cols-7 gap-2 text-center">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-xs font-semibold text-gray-400">
              {w}
            </div>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {cells.map((d, i) => {
              if (d === null) return <div key={`b-${i}`} />;
              const rec = statusByDay[dayKey(cursor.year, cursor.month, d)];
              const cfg = rec?.status ? STATUS_CONFIG[rec.status] : null;
              const future = isFuture(d);
              const base = "flex aspect-square items-center justify-center rounded-lg text-sm font-semibold";
              let cls;
              if (future) cls = "bg-gray-100 text-gray-300 dark:bg-gray-700/50 dark:text-gray-600";
              else if (cfg) cls = cfg.cell;
              else cls = "bg-gray-50 text-gray-400 dark:bg-gray-700/40";
              return (
                <div key={d} className={`${base} ${cls}`} title={rec?.status ? STATUS_CONFIG[rec.status]?.label : ""}>
                  {String(d).padStart(2, "0")}
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`h-3 w-3 rounded-sm ${cfg.dot}`} />
              {cfg.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
