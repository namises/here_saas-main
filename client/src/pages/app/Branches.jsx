import React, { useMemo, useState } from "react";
import { LuBuilding, LuMapPin, LuUsers, LuPlus, LuCrown } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useEmployeeOptions } from "src/API/hooks/useOptions";
import { BarChart, ChartCard, DonutChart, groupCount, groupSum } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, StatusBadge, Avatar } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];

const Branches = () => {
  const { items, loading, create, update, remove, submitting } = useResource({ name: "branch", listKey: "branches" });
  const managerOptions = useEmployeeOptions();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const byEmirate = useMemo(() => groupCount(items, "emirate"), [items]);
  const headcountByBranch = useMemo(() => groupSum(items, "name", "headcount"), [items]);
  const totalHeadcount = items.reduce((s, b) => s + (Number(b.headcount) || 0), 0);
  const active = items.filter((b) => b.status === "active").length;
  const emirates = new Set(items.map((b) => b.emirate)).size;

  const fields = [
    { name: "name", label: "Branch name", required: true, placeholder: "Dubai Marina HQ" },
    { name: "code", label: "Branch code", required: true, placeholder: "DXB-01" },
    { name: "emirate", label: "Emirate", type: "select", options: EMIRATES, default: "Dubai" },
    { name: "city", label: "City / Area" },
    { name: "address", label: "Address", type: "textarea" },
    { name: "phone", label: "Phone" },
    { name: "timezone", label: "Timezone", default: "Asia/Dubai" },
    { name: "manager", label: "Branch manager", type: "select", options: managerOptions },
    { name: "headcount", label: "Headcount", type: "number" },
    { name: "isHeadOffice", label: "Head office", type: "checkbox", hint: "Mark as head office" },
    { name: "status", label: "Status", type: "select", options: ["active", "inactive"], default: "active" },
  ];

  const columns = [
    { key: "name", header: "Branch", render: (r) => (
      <div className="flex items-center gap-2">
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-gray-800 dark:text-white">{r.name}{r.isHeadOffice && <LuCrown className="text-amber-500" title="Head office" />}</p>
          <p className="text-xs text-gray-400">{r.code}</p>
        </div>
      </div>
    ) },
    { key: "emirate", header: "Location", render: (r) => (<span className="flex items-center gap-1 text-sm"><LuMapPin className="text-gray-400" /> {r.city ? `${r.city}, ` : ""}{r.emirate}</span>) },
    { key: "manager", header: "Manager", render: (r) => (r.manager ? <div className="flex items-center gap-2"><Avatar name={r.manager.name} size={28} /><span className="text-sm">{r.manager.name}</span></div> : <span className="text-gray-400">—</span>) },
    { key: "headcount", header: "Headcount", render: (r) => <span className="font-medium">{r.headcount || 0}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader title="Multi-Branch Management" subtitle="Manage offices across the Emirates" Icon={LuBuilding} accent="#0ea5e9">
        <SolidButton title="Add Branch" Icon={LuPlus} onClick={() => { setEditing(null); setOpen(true); }} />
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Branches" value={items.length} Icon={LuBuilding} accent="#0ea5e9" />
        <StatCard label="Active" value={active} Icon={LuBuilding} accent="#10b981" />
        <StatCard label="Emirates Covered" value={emirates} Icon={LuMapPin} accent="#f59e0b" />
        <StatCard label="Total Headcount" value={totalHeadcount} Icon={LuUsers} accent="#8b5cf6" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Branches by Emirate">
          <DonutChart data={byEmirate} centerLabel="branches" />
        </ChartCard>
        <ChartCard title="Headcount by Branch">
          <BarChart horizontal data={headcountByBranch} />
        </ChartCard>
      </div>

      <ResourceTable columns={columns} rows={items} loading={loading} onEdit={(r) => { setEditing(r); setOpen(true); }} onDelete={(r) => window.confirm(`Delete branch "${r.name}"?`) && remove(r._id)} emptyIcon={LuBuilding} emptyTitle="No branches yet" emptyHint="Add your first branch office." />

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title={editing ? "Edit Branch" : "Add Branch"} fields={fields} editing={editing} submitting={submitting} onSubmit={editing ? update : create} />
    </>
  );
};

export default Branches;
