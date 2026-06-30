import React, { useMemo, useState } from "react";
import { Tabs, TabItem } from "flowbite-react";
import { LuGitPullRequestArrow, LuClock, LuCircleCheck, LuCircleX, LuPlus, LuCheck, LuX, LuTrash2, LuCalendarX2 } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import LeavesApprovalPanel from "src/components/LeavesApprovalPanel";
import { ChartCard, DonutChart, BarChart, groupCount } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, StatusBadge, Avatar, EmptyState } from "src/components/resource/Bits";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtMoney, relativeTime, titleCase } from "src/utils/ui";

const TYPES = ["leave", "expense", "asset", "document", "recruitment", "custom"];
const STATUSES = ["pending", "approved", "rejected"];

const Approvals = () => {
  const { items, loading, filters, setFilters, create, remove, submitting, api, refetch } = useResource({ name: "approval", listKey: "approvals" });
  const [open, setOpen] = useState(false);

  const byType = useMemo(() => groupCount(items, "type"), [items]);
  const byStatus = useMemo(() => groupCount(items, "status"), [items]);
  const count = (s) => items.filter((a) => a.status === s).length;
  const highPriority = items.filter((a) => a.priority === "high" && a.status === "pending").length;

  const act = async (id, decision) => {
    const res = await api.act({ id, decision });
    if (res?.success) refetch();
  };

  const fields = [
    { name: "title", label: "Request title", required: true, placeholder: "Purchase 5 laptops" },
    { name: "type", label: "Type", type: "select", options: TYPES, default: "custom", required: true },
    { name: "amount", label: "Amount (AED)", type: "money" },
    { name: "priority", label: "Priority", type: "select", options: ["low", "normal", "high"], default: "normal" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <>
      <PageHeader title="Approval Workflows" subtitle="Route and action multi-level approvals" Icon={LuGitPullRequestArrow} accent="#6366f1">
        <SolidButton title="New Request" Icon={LuPlus} onClick={() => setOpen(true)} />
      </PageHeader>

      <Tabs variant="underline">
        <TabItem active title="Workflow Requests" icon={LuGitPullRequestArrow}>
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending" value={count("pending")} Icon={LuClock} accent="#f59e0b" />
        <StatCard label="Approved" value={count("approved")} Icon={LuCircleCheck} accent="#10b981" />
        <StatCard label="Rejected" value={count("rejected")} Icon={LuCircleX} accent="#ef4444" />
        <StatCard label="High Priority" value={highPriority} Icon={LuClock} accent="#ec4899" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Requests by Type"><DonutChart data={byType} centerLabel="requests" /></ChartCard>
        <ChartCard title="By Status"><BarChart data={byStatus} /></ChartCard>
      </div>

      <div className="mb-4"><Segmented value={filters.status || null} onChange={(v) => setFilters((f) => ({ ...f, status: v || undefined }))} options={[{ value: null, label: "All" }, ...STATUSES]} /></div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState Icon={LuGitPullRequestArrow} title="No approval requests" hint="Raise a request to start a workflow." />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a._id} className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{a.title}</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-500 dark:bg-gray-700">{titleCase(a.type)}</span>
                    {a.priority === "high" && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:bg-rose-900/40">High</span>}
                    <StatusBadge status={a.status} />
                  </div>
                  {a.notes && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{a.notes}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {a.requestedBy?.name && <span className="flex items-center gap-1.5"><Avatar name={a.requestedBy.name} size={20} /> {a.requestedBy.name}</span>}
                    {a.amount > 0 && <span className="font-medium text-gray-600 dark:text-gray-300">{fmtMoney(a.amount)}</span>}
                    <span>{relativeTime(a.createdAt)}</span>
                  </div>
                  {a.steps?.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {a.steps.map((s, i) => (
                        <span key={i} className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] ${i === a.currentStep && a.status === "pending" ? "ring-2 ring-blue-300" : ""} ${s.status === "approved" ? "bg-emerald-50 text-emerald-600" : s.status === "rejected" ? "bg-rose-50 text-rose-600" : "bg-gray-50 text-gray-500 dark:bg-gray-700"}`}>
                          {s.role || `Step ${s.order}`}: {titleCase(s.status)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {a.status === "pending" && (
                    <>
                      <button onClick={() => act(a._id, "approved")} className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600"><LuCheck size="0.9rem" /> Approve</button>
                      <button onClick={() => act(a._id, "rejected")} className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600"><LuX size="0.9rem" /> Reject</button>
                    </>
                  )}
                  <button onClick={() => window.confirm("Delete request?") && remove(a._id)} className="rounded-lg p-2 text-gray-400 opacity-0 transition hover:text-rose-600 group-hover:opacity-100"><LuTrash2 size="0.9rem" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </TabItem>
        <TabItem title="Leaves" icon={LuCalendarX2}>
          <LeavesApprovalPanel />
        </TabItem>
      </Tabs>

      <ResourceFormDrawer open={open} onClose={() => setOpen(false)} title="New Approval Request" fields={fields} editing={null} submitting={submitting} onSubmit={create} />
    </>
  );
};

export default Approvals;
