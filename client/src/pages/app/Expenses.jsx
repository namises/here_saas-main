import React, { useMemo, useState } from "react";
import { LuReceipt, LuClock, LuCircleCheck, LuPlus, LuCheck, LuX } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useEmployeeOptions } from "src/API/hooks/useOptions";
import { ChartCard, DonutChart, LineChart, groupSum } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, StatusBadge, Avatar } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtDate, fmtMoney } from "src/utils/ui";

const CATEGORIES = ["travel", "food", "accommodation", "supplies", "software", "training", "other"];
const STATUSES = ["pending", "approved", "rejected", "reimbursed"];

const Expenses = () => {
  const { items, loading, filters, setFilters, create, update, remove, submitting } = useResource({ name: "expense", listKey: "expenses" });
  const employeeOptions = useEmployeeOptions();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const byCategory = useMemo(() => groupSum(items, "category", "amount"), [items]);
  const sumBy = (st) => items.filter((e) => e.status === st).reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const trend = useMemo(() => {
    const map = {};
    items.forEach((e) => {
      const d = new Date((e.date < 1e10 ? e.date * 1000 : e.date));
      const key = d.toLocaleDateString(undefined, { month: "short" });
      map[key] = (map[key] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [items]);

  const decide = (row, status) => update({ id: row._id, status, actionedAt: Math.floor(Date.now() / 1000) });

  const fields = [
    { name: "title", label: "Title", required: true, placeholder: "Client visit — taxi" },
    { name: "employee", label: "Employee", type: "select", options: employeeOptions, hint: "Defaults to you if left blank" },
    { name: "category", label: "Category", type: "select", options: CATEGORIES, default: "travel" },
    { name: "amount", label: "Amount", type: "money", required: true },
    { name: "currency", label: "Currency", default: "AED" },
    { name: "date", label: "Expense date", type: "date", required: true },
    { name: "receiptUrl", label: "Receipt URL" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  const columns = [
    { key: "title", header: "Claim", render: (r) => (
      <div>
        <p className="font-semibold text-gray-800 dark:text-white">{r.title}</p>
        <p className="text-xs capitalize text-gray-400">{r.category}</p>
      </div>
    ) },
    { key: "employee", header: "Employee", render: (r) => (r.employee ? <div className="flex items-center gap-2"><Avatar name={r.employee.name} size={28} /><span className="text-sm">{r.employee.name}</span></div> : "—") },
    { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">{fmtMoney(r.amount, r.currency)}</span> },
    { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
    { key: "status", header: "Status", render: (r) => (
      <div className="flex items-center gap-2">
        <StatusBadge status={r.status} />
        {r.status === "pending" && (
          <span className="flex gap-1">
            <button onClick={() => decide(r, "approved")} className="rounded-md bg-emerald-100 p-1 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/40" title="Approve"><LuCheck size="0.85rem" /></button>
            <button onClick={() => decide(r, "rejected")} className="rounded-md bg-rose-100 p-1 text-rose-600 hover:bg-rose-200 dark:bg-rose-900/40" title="Reject"><LuX size="0.85rem" /></button>
          </span>
        )}
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader title="Expense Management" subtitle="Submit, approve and reimburse expense claims" Icon={LuReceipt} accent="#f59e0b">
        <SolidButton title="New Claim" Icon={LuPlus} onClick={() => { setEditing(null); setOpen(true); }} />
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Claims" value={items.length} Icon={LuReceipt} accent="#f59e0b" />
        <StatCard label="Pending" value={fmtMoney(sumBy("pending"))} Icon={LuClock} accent="#f97316" />
        <StatCard label="Approved" value={fmtMoney(sumBy("approved"))} Icon={LuCircleCheck} accent="#10b981" />
        <StatCard label="Reimbursed" value={fmtMoney(sumBy("reimbursed"))} Icon={LuCircleCheck} accent="#3b82f6" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Spend by Category" subtitle="AED">
          <DonutChart data={byCategory} centerLabel="AED" centerValue={fmtMoney(byCategory.reduce((s, d) => s + d.value, 0)).replace("AED ", "")} />
        </ChartCard>
        <ChartCard title="Spend Trend">
          <LineChart data={trend} color="#f59e0b" formatValue={(v) => fmtMoney(v)} />
        </ChartCard>
      </div>

      <div className="mb-4">
        <Segmented value={filters.status || null} onChange={(v) => setFilters((f) => ({ ...f, status: v || undefined }))} options={[{ value: null, label: "All" }, ...STATUSES]} />
      </div>

      <ResourceTable columns={columns} rows={items} loading={loading} onEdit={(r) => { setEditing(r); setOpen(true); }} onDelete={(r) => window.confirm("Delete this claim?") && remove(r._id)} emptyIcon={LuReceipt} emptyTitle="No expense claims" emptyHint="Submit your first claim." />

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title={editing ? "Edit Claim" : "New Expense Claim"} fields={fields} editing={editing} submitting={submitting} onSubmit={editing ? update : create} />
    </>
  );
};

export default Expenses;
