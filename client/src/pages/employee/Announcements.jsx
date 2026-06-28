import React, { useEffect, useState } from "react";
import { LuMegaphone, LuPin } from "react-icons/lu";
import { API } from "src/API/api";
import { relativeTime, titleCase } from "src/utils/ui";

const PRIORITY = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  normal: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.announcement
      .list({ limit: 50 })
      .then((res) => setItems(res?.data?.announcements?.items || res?.data?.announcements || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Announcements</h1>
        <p className="text-sm text-gray-400">Latest updates from your organization.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-10 text-gray-300 dark:bg-gray-800">
          <LuMegaphone size="2rem" />
          <p className="text-sm">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a._id} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500 dark:bg-pink-900/30">
                  <LuMegaphone size="1.2rem" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{a.title}</p>
                    {a.pinned ? <LuPin className="text-amber-500" size="0.85rem" /> : null}
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] capitalize text-gray-500 dark:bg-gray-700">{titleCase(a.category)}</span>
                    {a.priority ? <span className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${PRIORITY[a.priority] || PRIORITY.normal}`}>{a.priority}</span> : null}
                  </div>
                  <p className="mt-1 whitespace-pre-line text-sm text-gray-500 dark:text-gray-400">{a.body}</p>
                  <p className="mt-2 text-xs text-gray-300">{relativeTime(a.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
