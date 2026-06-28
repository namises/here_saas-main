import React, { useEffect, useState } from "react";
import { LuFileText, LuDownload } from "react-icons/lu";
import { API } from "src/API/api";
import { titleCase } from "src/utils/ui";

const Documents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.document
      .list({ limit: 50 })
      .then((res) => setItems(res?.data?.documents?.items || res?.data?.documents || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Documents</h1>
        <p className="text-sm text-gray-400">Company policies, handbooks and forms.</p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-10 text-gray-300 dark:bg-gray-800">
          <LuFileText size="2rem" />
          <p className="text-sm">No documents available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((d) => (
            <a key={d._id} href={d.fileUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-800">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-900/30">
                <LuFileText size="1.2rem" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{d.title}</p>
                <p className="text-xs text-gray-400">
                  {titleCase(d.category)} · v{d.version || "1.0"}
                </p>
              </div>
              <LuDownload className="text-gray-300 transition group-hover:text-sky-500" size="1.1rem" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
