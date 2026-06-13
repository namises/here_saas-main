import React, { useMemo, useState } from "react";
import { LuMegaphone, LuPin, LuTriangleAlert, LuPlus, LuTrash2, LuPencil } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { ChartCard, DonutChart, groupCount } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, EmptyState, Avatar } from "src/components/resource/Bits";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { relativeTime, titleCase } from "src/utils/ui";

const CATEGORIES = ["general", "policy", "event", "holiday", "celebration", "urgent"];
const CAT_ACCENT = { general: "#3b82f6", policy: "#8b5cf6", event: "#06b6d4", holiday: "#10b981", celebration: "#ec4899", urgent: "#ef4444" };

const Announcements = () => {
  const { items, loading, filters, setFilters, create, update, remove, submitting } = useResource({ name: "announcement", listKey: "announcements" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const byCategory = useMemo(() => groupCount(items, "category"), [items]);
  const pinned = items.filter((a) => a.pinned).length;
  const urgent = items.filter((a) => a.category === "urgent" || a.priority === "high").length;
  const sorted = useMemo(() => [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)), [items]);

  const fields = [
    { name: "title", label: "Title", required: true, placeholder: "Eid Al Adha holidays" },
    { name: "body", label: "Message", type: "textarea", required: true },
    { name: "category", label: "Category", type: "select", options: CATEGORIES, default: "general" },
    { name: "priority", label: "Priority", type: "select", options: ["low", "normal", "high"], default: "normal" },
    { name: "audience", label: "Audience", type: "select", options: ["all", "branch", "department"], default: "all" },
    { name: "pinned", label: "Pin to top", type: "checkbox", hint: "Keep this announcement at the top" },
    { name: "expiresAt", label: "Expires on", type: "date" },
  ];

  return (
    <>
      <PageHeader title="Announcement Center" subtitle="Broadcast updates across the company" Icon={LuMegaphone} accent="#ec4899">
        <SolidButton title="New Announcement" Icon={LuPlus} onClick={() => { setEditing(null); setOpen(true); }} />
      </PageHeader>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-4 lg:col-span-2">
          <StatCard label="Total" value={items.length} Icon={LuMegaphone} accent="#ec4899" />
          <StatCard label="Pinned" value={pinned} Icon={LuPin} accent="#3b82f6" />
          <StatCard label="Urgent / High" value={urgent} Icon={LuTriangleAlert} accent="#ef4444" />
        </div>
        <ChartCard title="By Category" className="lg:col-span-1">
          <DonutChart data={byCategory} size={140} thickness={18} centerLabel="posts" />
        </ChartCard>
      </div>

      <div className="mb-4">
        <Segmented value={filters.category || null} onChange={(v) => setFilters((f) => ({ ...f, category: v || undefined }))} options={[{ value: null, label: "All" }, ...CATEGORIES]} />
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : sorted.length === 0 ? (
        <EmptyState Icon={LuMegaphone} title="No announcements" hint="Post your first company update." />
      ) : (
        <div className="space-y-3">
          {sorted.map((a) => {
            const accent = CAT_ACCENT[a.category] || "#3b82f6";
            return (
              <div key={a._id} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <span className="absolute left-0 top-0 h-full w-1" style={{ background: accent }} />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {a.pinned && <LuPin className="text-blue-500" title="Pinned" />}
                      <h3 className="font-semibold text-gray-800 dark:text-white">{a.title}</h3>
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: `${accent}1a`, color: accent }}>{titleCase(a.category)}</span>
                      {a.priority === "high" && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:bg-rose-900/40">High priority</span>}
                    </div>
                    <p className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">{a.body}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      {a.publishedBy?.name && <><Avatar name={a.publishedBy.name} size={22} /><span>{a.publishedBy.name}</span><span>·</span></>}
                      <span>{relativeTime(a.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => { setEditing(a); setOpen(true); }} className="rounded-lg p-2 text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700"><LuPencil size="0.9rem" /></button>
                    <button onClick={() => window.confirm("Delete this announcement?") && remove(a._id)} className="rounded-lg p-2 text-gray-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-gray-700"><LuTrash2 size="0.9rem" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title={editing ? "Edit Announcement" : "New Announcement"} fields={fields} editing={editing} submitting={submitting} onSubmit={editing ? update : create} />
    </>
  );
};

export default Announcements;
