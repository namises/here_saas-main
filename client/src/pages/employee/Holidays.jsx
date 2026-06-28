import React, { useEffect, useState } from "react";
import { LuCalendarDays, LuPartyPopper } from "react-icons/lu";
import { API } from "src/API/api";
import { fmtDate, toMs } from "src/utils/ui";

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.holiday
      .list({})
      .then((res) => {
        const list = res?.data?.holidays || [];
        list.sort((a, b) => (a.date || 0) - (b.date || 0));
        setHolidays(list);
      })
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Holidays</h1>
        <p className="text-sm text-gray-400">Company holiday calendar.</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : holidays.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-10 text-gray-300 dark:bg-gray-800">
          <LuCalendarDays size="2rem" />
          <p className="text-sm">No holidays listed.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {holidays.map((h) => {
            const upcoming = toMs(h.date) >= now;
            return (
              <div key={h._id} className={`flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-800 ${upcoming ? "border-emerald-100 dark:border-emerald-900/40" : "border-gray-100 dark:border-gray-700"}`}>
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${upcoming ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30" : "bg-gray-100 text-gray-400 dark:bg-gray-700"}`}>
                  <LuPartyPopper size="1.3rem" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{h.name}</p>
                  {h.remarks ? <p className="truncate text-xs text-gray-400">{h.remarks}</p> : null}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{fmtDate(h.date)}</p>
                  {upcoming ? <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-500">Upcoming</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Holidays;
