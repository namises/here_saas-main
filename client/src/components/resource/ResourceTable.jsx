import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { EmptyState } from "./Bits";

/**
 * Generic, responsive table.
 * @param {object[]} columns  [{ key, header, render?, className? }]
 * @param {object[]} rows
 * @param {(row)=>void} [onEdit]
 * @param {(row)=>void} [onDelete]
 */
const ResourceTable = ({ columns, rows = [], loading, onEdit, onDelete, emptyIcon, emptyTitle, emptyHint, rowKey = "_id" }) => {
  if (!loading && rows.length === 0) return <EmptyState Icon={emptyIcon} title={emptyTitle} hint={emptyHint} />;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/80 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`px-4 py-3 font-semibold ${c.className || ""}`}>
                  {c.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/60">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3.5">
                        <div className="h-3 w-3/4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700" />
                      </td>
                    ))}
                    {(onEdit || onDelete) && <td className="px-4 py-3.5" />}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr key={row[rowKey]} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-gray-700/30">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3.5 text-gray-700 dark:text-gray-200 ${c.className || ""}`}>
                        {c.render ? c.render(row) : row[c.key] ?? "—"}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-1">
                          {onEdit && (
                            <button onClick={() => onEdit(row)} className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700" title="Edit">
                              <FiEdit2 size="0.95rem" />
                            </button>
                          )}
                          {onDelete && (
                            <button onClick={() => onDelete(row)} className="rounded-lg p-2 text-gray-400 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-gray-700" title="Delete">
                              <FiTrash2 size="0.95rem" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourceTable;
