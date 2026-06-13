import React, { useMemo, useState } from "react";
import { LuTrendingUp, LuTarget, LuStar, LuPlus, LuTrash2, LuPencil } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useEmployeeOptions } from "src/API/hooks/useOptions";
import { ChartCard, DonutChart, BarChart, groupCount } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, StatusBadge, Avatar, EmptyState } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtDate, titleCase } from "src/utils/ui";

const REVIEW_STATUS = ["draft", "self-review", "manager-review", "completed"];
const GOAL_STATUS = ["not-started", "in-progress", "completed", "overdue"];
const progressColor = (p) => (p >= 100 ? "#10b981" : p >= 50 ? "#3b82f6" : p > 0 ? "#f59e0b" : "#94a3b8");

const Performance = () => {
  const reviews = useResource({ name: "performance", listKey: "reviews" });
  const goals = useResource({ name: "goal", listKey: "goals" });
  const employeeOptions = useEmployeeOptions();
  const [tab, setTab] = useState("reviews");
  const [revOpen, setRevOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [editingRev, setEditingRev] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  const reviewStatus = useMemo(() => groupCount(reviews.items, "status"), [reviews.items]);
  const goalsByStatus = useMemo(() => groupCount(goals.items, "status"), [goals.items]);
  const ratedReviews = reviews.items.filter((r) => r.overallRating > 0);
  const avgRating = ratedReviews.length ? (ratedReviews.reduce((s, r) => s + r.overallRating, 0) / ratedReviews.length).toFixed(1) : "—";
  const completed = reviews.items.filter((r) => r.status === "completed").length;
  const onTrack = goals.items.filter((g) => g.status === "in-progress" || g.status === "completed").length;
  const overdue = goals.items.filter((g) => g.status === "overdue").length;

  const revFields = [
    { name: "employee", label: "Employee", type: "select", options: employeeOptions, required: true },
    { name: "reviewer", label: "Reviewer", type: "select", options: employeeOptions },
    { name: "cycle", label: "Review cycle", required: true, placeholder: "2026-H1" },
    { name: "period", label: "Period", type: "select", options: ["quarterly", "half-yearly", "annual"], default: "annual" },
    { name: "overallRating", label: "Overall rating (0-5)", type: "number", min: 0, max: 5 },
    { name: "goalsAchieved", label: "Goals achieved", type: "number" },
    { name: "strengths", label: "Strengths", type: "textarea" },
    { name: "improvements", label: "Areas to improve", type: "textarea" },
    { name: "status", label: "Status", type: "select", options: REVIEW_STATUS, default: "draft" },
  ];

  const goalFields = [
    { name: "employee", label: "Employee", type: "select", options: employeeOptions },
    { name: "title", label: "Goal", required: true, placeholder: "Increase regional sales by 20%" },
    { name: "category", label: "Category", type: "select", options: ["business", "personal", "team", "learning"], default: "business" },
    { name: "weightage", label: "Weightage (%)", type: "number", min: 0, max: 100, default: 100 },
    { name: "progress", label: "Progress (%)", type: "number", min: 0, max: 100 },
    { name: "dueDate", label: "Due date", type: "date" },
    { name: "status", label: "Status", type: "select", options: GOAL_STATUS, default: "not-started" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  const reviewColumns = [
    { key: "employee", header: "Employee", render: (r) => (r.employee ? <div className="flex items-center gap-2"><Avatar name={r.employee.name} size={30} /><div><p className="text-sm font-semibold text-gray-800 dark:text-white">{r.employee.name}</p><p className="text-xs text-gray-400">{r.employee.designation || ""}</p></div></div> : "—") },
    { key: "cycle", header: "Cycle", render: (r) => <span>{r.cycle} · {titleCase(r.period)}</span> },
    { key: "overallRating", header: "Rating", render: (r) => (<span className="flex items-center gap-0.5 text-amber-500">{Array.from({ length: 5 }).map((_, i) => <LuStar key={i} size="0.8rem" fill={i < Math.round(r.overallRating) ? "currentColor" : "none"} />)}<span className="ml-1 text-xs text-gray-500">{r.overallRating || 0}</span></span>) },
    { key: "reviewer", header: "Reviewer", render: (r) => r.reviewer?.name || "—" },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader title="Performance Management" subtitle="Reviews, ratings and goal tracking" Icon={LuTrendingUp} accent="#10b981">
        {tab === "reviews" ? <SolidButton title="New Review" Icon={LuPlus} onClick={() => { setEditingRev(null); setRevOpen(true); }} /> : <SolidButton title="New Goal" Icon={LuPlus} onClick={() => { setEditingGoal(null); setGoalOpen(true); }} />}
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Avg Rating" value={avgRating} suffix="/5" Icon={LuStar} accent="#f59e0b" />
        <StatCard label="Reviews Done" value={completed} Icon={LuTrendingUp} accent="#10b981" />
        <StatCard label="Goals On Track" value={onTrack} Icon={LuTarget} accent="#3b82f6" />
        <StatCard label="Overdue Goals" value={overdue} Icon={LuTarget} accent="#ef4444" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Review Status"><DonutChart data={reviewStatus} centerLabel="reviews" /></ChartCard>
        <ChartCard title="Goals by Status"><BarChart data={goalsByStatus} /></ChartCard>
      </div>

      <div className="mb-4"><Segmented value={tab} onChange={setTab} options={[{ value: "reviews", label: "Reviews" }, { value: "goals", label: "Goals & OKRs" }]} /></div>

      {tab === "reviews" ? (
        <ResourceTable columns={reviewColumns} rows={reviews.items} loading={reviews.loading} onEdit={(r) => { setEditingRev(r); setRevOpen(true); }} onDelete={(r) => window.confirm("Delete this review?") && reviews.remove(r._id)} emptyIcon={LuTrendingUp} emptyTitle="No reviews yet" emptyHint="Start a performance review cycle." />
      ) : goals.items.length === 0 && !goals.loading ? (
        <EmptyState Icon={LuTarget} title="No goals yet" hint="Set goals and OKRs for your team." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.items.map((g) => (
            <div key={g._id} className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-2 flex items-start justify-between">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-500 dark:bg-gray-700">{g.category}</span>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => { setEditingGoal(g); setGoalOpen(true); }} className="rounded p-1 text-gray-400 hover:text-blue-600"><LuPencil size="0.85rem" /></button>
                  <button onClick={() => window.confirm("Delete goal?") && goals.remove(g._id)} className="rounded p-1 text-gray-400 hover:text-rose-600"><LuTrash2 size="0.85rem" /></button>
                </div>
              </div>
              <p className="font-semibold text-gray-800 dark:text-white">{g.title}</p>
              {g.employee?.name && <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400"><Avatar name={g.employee.name} size={18} /> {g.employee.name}</p>}
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs"><span className="text-gray-400">Progress</span><span className="font-semibold" style={{ color: progressColor(g.progress) }}>{g.progress || 0}%</span></div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${g.progress || 0}%`, background: progressColor(g.progress) }} /></div>
              </div>
              <div className="mt-3 flex items-center justify-between"><StatusBadge status={g.status} /><span className="text-xs text-gray-400">{g.dueDate ? `Due ${fmtDate(g.dueDate)}` : "No due date"}</span></div>
            </div>
          ))}
        </div>
      )}

      <ResourceFormDrawer open={revOpen} onClose={() => setRevOpen(false)} title={editingRev ? "Edit Review" : "New Review"} fields={revFields} editing={editingRev} submitting={reviews.submitting} onSubmit={editingRev ? reviews.update : reviews.create} />
      <ResourceFormDrawer open={goalOpen} onClose={() => setGoalOpen(false)} title={editingGoal ? "Edit Goal" : "New Goal"} fields={goalFields} editing={editingGoal} submitting={goals.submitting} onSubmit={editingGoal ? goals.update : goals.create} />
    </>
  );
};

export default Performance;
