import React, { useMemo, useState } from "react";
import { LuShieldCheck, LuTriangleAlert, LuCalendarClock, LuPlus, LuIdCard } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useEmployeeOptions } from "src/API/hooks/useOptions";
import { ChartCard, DonutChart, BarChart, groupCount } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, StatusBadge, Avatar, EmptyState } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtDate, daysUntil, titleCase } from "src/utils/ui";

const DOC_TYPES = ["emirates-id", "residence-visa", "labour-card", "passport", "work-permit", "health-insurance", "labour-contract"];
const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
const STATUSES = ["valid", "expiring-soon", "expired", "under-renewal"];

const liveStatus = (r) => {
  if (r.status === "under-renewal") return "under-renewal";
  const d = daysUntil(r.expiryDate);
  if (d === null) return "valid";
  if (d < 0) return "expired";
  if (d <= 30) return "expiring-soon";
  return "valid";
};

const Compliance = () => {
  const { items, loading, filters, setFilters, create, update, remove, submitting } = useResource({ name: "compliance", listKey: "records" });
  const employeeOptions = useEmployeeOptions();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const withStatus = useMemo(() => items.map((r) => ({ ...r, _live: liveStatus(r) })), [items]);
  const byStatus = useMemo(() => groupCount(withStatus, "_live"), [withStatus]);
  const byType = useMemo(() => groupCount(items, (r) => titleCase(r.documentType)), [items]);
  const count = (s) => withStatus.filter((r) => r._live === s).length;
  const upcoming = useMemo(() => withStatus.filter((r) => { const d = daysUntil(r.expiryDate); return d !== null && d >= 0 && d <= 60; }).sort((a, b) => a.expiryDate - b.expiryDate).slice(0, 6), [withStatus]);

  const fields = [
    { name: "employee", label: "Employee", type: "select", options: employeeOptions, required: true },
    { name: "documentType", label: "Document type", type: "select", options: DOC_TYPES, default: "emirates-id", required: true },
    { name: "documentNumber", label: "Document number", required: true, placeholder: "784-XXXX-XXXXXXX-X" },
    { name: "issuingEmirate", label: "Issuing emirate", type: "select", options: EMIRATES, default: "Dubai" },
    { name: "issueDate", label: "Issue date", type: "date" },
    { name: "expiryDate", label: "Expiry date", type: "date", required: true },
    { name: "fileUrl", label: "Document URL" },
    { name: "status", label: "Override status", type: "select", options: STATUSES, hint: "Set 'under-renewal' while renewing" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  const columns = [
    { key: "employee", header: "Employee", render: (r) => (r.employee ? <div className="flex items-center gap-2"><Avatar name={r.employee.name} size={30} /><div><p className="text-sm font-semibold text-gray-800 dark:text-white">{r.employee.name}</p><p className="text-xs text-gray-400">{r.employee.empCode || ""}</p></div></div> : "—") },
    { key: "documentType", header: "Document", render: (r) => (<div><p className="font-medium">{titleCase(r.documentType)}</p><p className="text-xs text-gray-400">{r.documentNumber}</p></div>) },
    { key: "issuingEmirate", header: "Emirate", render: (r) => r.issuingEmirate },
    { key: "expiryDate", header: "Expiry", render: (r) => { const d = daysUntil(r.expiryDate); return (<div><p>{fmtDate(r.expiryDate)}</p><p className={`text-xs ${d < 0 ? "text-rose-500" : d <= 30 ? "text-amber-500" : "text-gray-400"}`}>{d < 0 ? `${Math.abs(d)}d overdue` : `${d}d left`}</p></div>); } },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r._live} /> },
  ];

  return (
    <>
      <PageHeader title="UAE Compliance" subtitle="Track Emirates ID, visas, labour cards & permits" Icon={LuShieldCheck} accent="#10b981">
        <SolidButton title="Add Document" Icon={LuPlus} onClick={() => { setEditing(null); setOpen(true); }} />
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tracked Docs" value={items.length} Icon={LuIdCard} accent="#3b82f6" />
        <StatCard label="Valid" value={count("valid")} Icon={LuShieldCheck} accent="#10b981" />
        <StatCard label="Expiring ≤30d" value={count("expiring-soon")} Icon={LuCalendarClock} accent="#f59e0b" />
        <StatCard label="Expired" value={count("expired")} Icon={LuTriangleAlert} accent="#ef4444" />
      </div>

      {upcoming.length > 0 && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400"><LuCalendarClock /> Expiring within 60 days</p>
          <div className="flex flex-wrap gap-2">
            {upcoming.map((r) => (
              <span key={r._id} className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs shadow-sm dark:bg-gray-800">
                <Avatar name={r.employee?.name || "?"} size={20} />
                <span className="font-medium text-gray-700 dark:text-gray-200">{r.employee?.name}</span>
                <span className="text-gray-400">{titleCase(r.documentType)}</span>
                <span className="font-semibold text-amber-600">{daysUntil(r.expiryDate)}d</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Compliance Status"><DonutChart data={byStatus} centerLabel="documents" /></ChartCard>
        <ChartCard title="Documents by Type"><BarChart horizontal data={byType} /></ChartCard>
      </div>

      <div className="mb-4"><Segmented value={filters.status || null} onChange={(v) => setFilters((f) => ({ ...f, status: v || undefined }))} options={[{ value: null, label: "All" }, ...STATUSES]} /></div>

      <ResourceTable columns={columns} rows={withStatus} loading={loading} onEdit={(r) => { setEditing(r); setOpen(true); }} onDelete={(r) => window.confirm("Delete compliance record?") && remove(r._id)} emptyIcon={LuShieldCheck} emptyTitle="No documents tracked" emptyHint="Add Emirates ID, visa or labour card records." />

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title={editing ? "Edit Document" : "Add Compliance Document"} fields={fields} editing={editing} submitting={submitting} onSubmit={editing ? update : create} />
    </>
  );
};

export default Compliance;
