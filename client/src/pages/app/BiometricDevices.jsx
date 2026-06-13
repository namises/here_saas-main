import React, { useMemo, useState } from "react";
import { LuFingerprint, LuWifi, LuWifiOff, LuUsers, LuPlus, LuRefreshCw } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useResourceOptions } from "src/API/hooks/useOptions";
import { ChartCard, DonutChart, BarChart, groupCount } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, StatusBadge } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtDateTime, titleCase } from "src/utils/ui";

const TYPES = ["fingerprint", "face", "iris", "rfid", "hybrid"];
const STATUSES = ["online", "offline", "maintenance"];

const BiometricDevices = () => {
  const { items, loading, filters, setFilters, create, update, remove, submitting } = useResource({ name: "biometric", listKey: "devices" });
  const branchOptions = useResourceOptions("branch", "branches");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const byStatus = useMemo(() => groupCount(items, "status"), [items]);
  const byType = useMemo(() => groupCount(items, (d) => titleCase(d.deviceType)), [items]);
  const online = items.filter((d) => d.status === "online").length;
  const enrolled = items.reduce((s, d) => s + (Number(d.enrolledUsers) || 0), 0);

  const sync = (d) => update({ id: d._id, status: "online", lastSyncAt: Math.floor(Date.now() / 1000) });

  const fields = [
    { name: "name", label: "Device name", required: true, placeholder: "Main Entrance Terminal" },
    { name: "serialNumber", label: "Serial number", required: true },
    { name: "deviceType", label: "Device type", type: "select", options: TYPES, default: "fingerprint" },
    { name: "vendor", label: "Vendor", default: "ZKTeco" },
    { name: "ipAddress", label: "IP address", placeholder: "192.168.1.50" },
    { name: "location", label: "Location", placeholder: "Ground floor lobby" },
    { name: "firmware", label: "Firmware" },
    { name: "enrolledUsers", label: "Enrolled users", type: "number" },
    { name: "branch", label: "Branch", type: "select", options: branchOptions },
    { name: "status", label: "Status", type: "select", options: STATUSES, default: "offline" },
  ];

  const columns = [
    { key: "name", header: "Device", render: (r) => (<div><p className="font-semibold text-gray-800 dark:text-white">{r.name}</p><p className="text-xs text-gray-400">{r.serialNumber} · {r.vendor}</p></div>) },
    { key: "deviceType", header: "Type", render: (r) => <span className="capitalize">{r.deviceType}</span> },
    { key: "location", header: "Location", render: (r) => r.location || (r.branch?.name ?? "—") },
    { key: "enrolledUsers", header: "Enrolled", render: (r) => <span className="font-medium">{r.enrolledUsers || 0}</span> },
    { key: "lastSyncAt", header: "Last Sync", render: (r) => fmtDateTime(r.lastSyncAt) },
    { key: "status", header: "Status", render: (r) => (<div className="flex items-center gap-2"><StatusBadge status={r.status} /><button onClick={() => sync(r)} className="rounded-md bg-blue-50 p-1 text-blue-600 hover:bg-blue-100 dark:bg-gray-700" title="Sync now"><LuRefreshCw size="0.8rem" /></button></div>) },
  ];

  return (
    <>
      <PageHeader title="Biometric Devices" subtitle="Fingerprint, face & RFID terminal registry" Icon={LuFingerprint} accent="#06b6d4">
        <SolidButton title="Add Device" Icon={LuPlus} onClick={() => { setEditing(null); setOpen(true); }} />
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Devices" value={items.length} Icon={LuFingerprint} accent="#06b6d4" />
        <StatCard label="Online" value={online} Icon={LuWifi} accent="#10b981" />
        <StatCard label="Offline" value={items.length - online} Icon={LuWifiOff} accent="#94a3b8" />
        <StatCard label="Enrolled Users" value={enrolled} Icon={LuUsers} accent="#8b5cf6" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Device Status"><DonutChart data={byStatus} centerLabel="devices" /></ChartCard>
        <ChartCard title="By Device Type"><BarChart data={byType} /></ChartCard>
      </div>

      <div className="mb-4"><Segmented value={filters.status || null} onChange={(v) => setFilters((f) => ({ ...f, status: v || undefined }))} options={[{ value: null, label: "All" }, ...STATUSES]} /></div>

      <ResourceTable columns={columns} rows={items} loading={loading} onEdit={(r) => { setEditing(r); setOpen(true); }} onDelete={(r) => window.confirm(`Delete device "${r.name}"?`) && remove(r._id)} emptyIcon={LuFingerprint} emptyTitle="No devices registered" emptyHint="Register your first biometric terminal." />

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title={editing ? "Edit Device" : "Add Biometric Device"} fields={fields} editing={editing} submitting={submitting} onSubmit={editing ? update : create} />
    </>
  );
};

export default BiometricDevices;
