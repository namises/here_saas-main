import React, { useMemo, useState } from "react";
import { LuMonitorSmartphone, LuPackageCheck, LuPackageOpen, LuWallet, LuPlus } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useEmployeeOptions, useResourceOptions } from "src/API/hooks/useOptions";
import { BarChart, ChartCard, DonutChart, groupCount, groupSum } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, StatusBadge, Avatar } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtDate, fmtMoney } from "src/utils/ui";

const CATEGORIES = ["laptop", "mobile", "vehicle", "furniture", "software", "accessory", "other"];
const STATUSES = ["available", "assigned", "maintenance", "retired"];

const Assets = () => {
  const { items, loading, filters, setFilters, create, update, remove, submitting } = useResource({ name: "asset", listKey: "assets" });
  const employeeOptions = useEmployeeOptions();
  const branchOptions = useResourceOptions("branch", "branches");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const byStatus = useMemo(() => groupCount(items, "status"), [items]);
  const byCategory = useMemo(() => groupCount(items, "category"), [items]);
  const valueByCategory = useMemo(() => groupSum(items, "category", "purchaseCost"), [items]);
  const totalValue = items.reduce((s, a) => s + (Number(a.purchaseCost) || 0), 0);
  const assigned = items.filter((a) => a.status === "assigned").length;
  const available = items.filter((a) => a.status === "available").length;

  const fields = [
    { name: "name", label: "Asset name", required: true, placeholder: "MacBook Pro 16”" },
    { name: "assetTag", label: "Asset tag", required: true, placeholder: "AST-0001" },
    { name: "category", label: "Category", type: "select", options: CATEGORIES, default: "laptop" },
    { name: "serialNumber", label: "Serial number" },
    { name: "purchaseCost", label: "Purchase cost (AED)", type: "money" },
    { name: "purchaseDate", label: "Purchase date", type: "date" },
    { name: "warrantyExpiry", label: "Warranty expiry", type: "date" },
    { name: "status", label: "Status", type: "select", options: STATUSES, default: "available" },
    { name: "condition", label: "Condition", type: "select", options: ["new", "good", "fair", "poor"], default: "good" },
    { name: "branch", label: "Branch", type: "select", options: branchOptions },
    { name: "assignedTo", label: "Assigned to", type: "select", options: employeeOptions },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  const openCreate = () => { setEditing(null); setOpen(true); };
  const openEdit = (row) => { setEditing(row); setOpen(true); };
  const onDelete = (row) => window.confirm(`Delete asset "${row.name}"?`) && remove(row._id);

  const columns = [
    { key: "name", header: "Asset", render: (r) => (
      <div>
        <p className="font-semibold text-gray-800 dark:text-white">{r.name}</p>
        <p className="text-xs text-gray-400">{r.assetTag} · {r.serialNumber || "no serial"}</p>
      </div>
    ) },
    { key: "category", header: "Category", render: (r) => <span className="capitalize">{r.category}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "assignedTo", header: "Assigned To", render: (r) => (r.assignedTo ? (
      <div className="flex items-center gap-2"><Avatar name={r.assignedTo.name} size={28} /><span className="text-sm">{r.assignedTo.name}</span></div>
    ) : <span className="text-gray-400">Unassigned</span>) },
    { key: "purchaseCost", header: "Value", render: (r) => fmtMoney(r.purchaseCost) },
    { key: "warrantyExpiry", header: "Warranty", render: (r) => fmtDate(r.warrantyExpiry) },
  ];

  return (
    <>
      <PageHeader title="Asset Management" subtitle="Track, assign and audit company assets" Icon={LuMonitorSmartphone} accent="#6366f1">
        <SolidButton title="Add Asset" Icon={LuPlus} onClick={openCreate} />
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Assets" value={items.length} Icon={LuMonitorSmartphone} accent="#6366f1" />
        <StatCard label="Assigned" value={assigned} Icon={LuPackageCheck} accent="#10b981" />
        <StatCard label="Available" value={available} Icon={LuPackageOpen} accent="#f59e0b" />
        <StatCard label="Total Value" value={fmtMoney(totalValue)} Icon={LuWallet} accent="#3b82f6" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Assets by Status">
          <DonutChart data={byStatus} centerLabel="assets" />
        </ChartCard>
        <ChartCard title="Value by Category" subtitle="Total purchase cost (AED)">
          <BarChart horizontal data={valueByCategory} formatValue={(v) => fmtMoney(v)} />
        </ChartCard>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Segmented value={filters.status || null} onChange={(v) => setFilters((f) => ({ ...f, status: v || undefined }))} options={[{ value: null, label: "All" }, ...STATUSES]} />
        <p className="text-xs text-gray-400">{items.length} shown</p>
      </div>

      <ResourceTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={onDelete} emptyIcon={LuMonitorSmartphone} emptyTitle="No assets yet" emptyHint="Add your first asset to start tracking." />

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title={editing ? "Edit Asset" : "Add Asset"} fields={fields} editing={editing} submitting={submitting} onSubmit={editing ? update : create} />
    </>
  );
};

export default Assets;
