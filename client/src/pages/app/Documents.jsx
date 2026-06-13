import React, { useMemo, useState } from "react";
import { LuFileText, LuFileWarning, LuFolderOpen, LuPlus, LuDownload, LuTrash2, LuPencil } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useEmployeeOptions } from "src/API/hooks/useOptions";
import { ChartCard, DonutChart, groupCount } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, EmptyState } from "src/components/resource/Bits";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtDate, daysUntil, titleCase } from "src/utils/ui";

const CATEGORIES = ["policy", "contract", "license", "certificate", "handbook", "form", "other"];
const CAT_ACCENT = { policy: "#8b5cf6", contract: "#3b82f6", license: "#f59e0b", certificate: "#10b981", handbook: "#06b6d4", form: "#ec4899", other: "#64748b" };

const Documents = () => {
  const { items, loading, filters, setFilters, create, update, remove, submitting } = useResource({ name: "document", listKey: "documents" });
  const ownerOptions = useEmployeeOptions();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const byCategory = useMemo(() => groupCount(items, "category"), [items]);
  const expiringSoon = items.filter((d) => d.expiresAt && daysUntil(d.expiresAt) !== null && daysUntil(d.expiresAt) <= 30 && daysUntil(d.expiresAt) >= 0).length;
  const categories = new Set(items.map((d) => d.category)).size;

  const fields = [
    { name: "title", label: "Document title", required: true, placeholder: "Trade License 2026" },
    { name: "category", label: "Category", type: "select", options: CATEGORIES, default: "policy" },
    { name: "fileUrl", label: "File URL", required: true, placeholder: "https://…", hint: "Link to the stored document" },
    { name: "fileType", label: "File type", placeholder: "pdf" },
    { name: "version", label: "Version", default: "1.0" },
    { name: "owner", label: "Owner", type: "select", options: ownerOptions },
    { name: "visibility", label: "Visibility", type: "select", options: ["all", "managers", "admins"], default: "all" },
    { name: "expiresAt", label: "Expiry date", type: "date" },
  ];

  return (
    <>
      <PageHeader title="Document Management" subtitle="Central repository for company documents" Icon={LuFileText} accent="#8b5cf6">
        <SolidButton title="Add Document" Icon={LuPlus} onClick={() => { setEditing(null); setOpen(true); }} />
      </PageHeader>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-4 lg:col-span-2">
          <StatCard label="Documents" value={items.length} Icon={LuFileText} accent="#8b5cf6" />
          <StatCard label="Categories" value={categories} Icon={LuFolderOpen} accent="#3b82f6" />
          <StatCard label="Expiring ≤30d" value={expiringSoon} Icon={LuFileWarning} accent="#ef4444" />
        </div>
        <ChartCard title="By Category" className="lg:col-span-1"><DonutChart data={byCategory} size={140} thickness={18} centerLabel="docs" /></ChartCard>
      </div>

      <div className="mb-4"><Segmented value={filters.category || null} onChange={(v) => setFilters((f) => ({ ...f, category: v || undefined }))} options={[{ value: null, label: "All" }, ...CATEGORIES]} /></div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState Icon={LuFileText} title="No documents" hint="Upload company policies, licenses and contracts." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((d) => {
            const accent = CAT_ACCENT[d.category] || "#64748b";
            const dleft = daysUntil(d.expiresAt);
            return (
              <div key={d._id} className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${accent}1a`, color: accent }}><LuFileText size="1.4rem" /></span>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => { setEditing(d); setOpen(true); }} className="rounded p-1.5 text-gray-400 hover:text-blue-600"><LuPencil size="0.85rem" /></button>
                    <button onClick={() => window.confirm("Delete document?") && remove(d._id)} className="rounded p-1.5 text-gray-400 hover:text-rose-600"><LuTrash2 size="0.85rem" /></button>
                  </div>
                </div>
                <p className="mt-3 font-semibold text-gray-800 dark:text-white">{d.title}</p>
                <p className="text-xs text-gray-400">{titleCase(d.category)} · v{d.version} · {d.visibility}</p>
                {d.expiresAt ? (
                  <p className={`mt-2 text-xs font-medium ${dleft < 0 ? "text-rose-500" : dleft <= 30 ? "text-amber-500" : "text-gray-400"}`}>{dleft < 0 ? `Expired ${fmtDate(d.expiresAt)}` : `Expires ${fmtDate(d.expiresAt)}`}</p>
                ) : null}
                {d.fileUrl && <a href={d.fileUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"><LuDownload size="0.9rem" /> Open file</a>}
              </div>
            );
          })}
        </div>
      )}

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title={editing ? "Edit Document" : "Add Document"} fields={fields} editing={editing} submitting={submitting} onSubmit={editing ? update : create} />
    </>
  );
};

export default Documents;
