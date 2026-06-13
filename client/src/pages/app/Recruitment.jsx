import React, { useMemo, useState } from "react";
import { LuBriefcase, LuUsers, LuUserCheck, LuPlus, LuStar, LuChevronRight, LuTrash2 } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { useEmployeeOptions, useResourceOptions } from "src/API/hooks/useOptions";
import { BarChart, ChartCard, DonutChart, groupCount } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, Segmented, StatusBadge, Avatar, EmptyState } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import ResourceFormDrawer from "src/components/resource/ResourceFormDrawer";
import SolidButton from "src/components/SolidButton";
import { fmtMoney, titleCase } from "src/utils/ui";

const STAGES = ["applied", "screening", "interview", "offer", "hired"];
const STAGE_ACCENT = { applied: "#0ea5e9", screening: "#8b5cf6", interview: "#6366f1", offer: "#f59e0b", hired: "#10b981" };
const SOURCES = ["referral", "linkedin", "website", "agency", "walk-in", "other"];

const Recruitment = () => {
  const jobs = useResource({ name: "job", listKey: "jobs" });
  const candidates = useResource({ name: "candidate", listKey: "candidates" });
  const jobOptions = useResourceOptions("job", "jobs", "title");
  const departmentOptions = useResourceOptions("department", "departments");
  const managerOptions = useEmployeeOptions();

  const [tab, setTab] = useState("pipeline");
  const [jobOpen, setJobOpen] = useState(false);
  const [candOpen, setCandOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingCand, setEditingCand] = useState(null);

  const funnel = useMemo(() => STAGES.map((s) => ({ label: titleCase(s), value: candidates.items.filter((c) => c.stage === s).length, color: STAGE_ACCENT[s] })), [candidates.items]);
  const bySource = useMemo(() => groupCount(candidates.items, "source"), [candidates.items]);
  const openJobs = jobs.items.filter((j) => j.status === "open").length;
  const hired = candidates.items.filter((c) => c.stage === "hired").length;
  const inInterview = candidates.items.filter((c) => c.stage === "interview").length;

  const jobFields = [
    { name: "title", label: "Job title", required: true, placeholder: "Senior Accountant" },
    { name: "code", label: "Requisition code" },
    { name: "department", label: "Department", type: "select", options: departmentOptions },
    { name: "employmentType", label: "Employment type", type: "select", options: ["full-time", "part-time", "contract", "internship"], default: "full-time" },
    { name: "location", label: "Location", placeholder: "Dubai, UAE" },
    { name: "openings", label: "Openings", type: "number", default: 1 },
    { name: "minSalary", label: "Min salary (AED)", type: "money" },
    { name: "maxSalary", label: "Max salary (AED)", type: "money" },
    { name: "hiringManager", label: "Hiring manager", type: "select", options: managerOptions },
    { name: "status", label: "Status", type: "select", options: ["open", "on-hold", "closed", "filled"], default: "open" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  const candFields = [
    { name: "name", label: "Candidate name", required: true },
    { name: "email", label: "Email", required: true },
    { name: "phone", label: "Phone" },
    { name: "job", label: "Applying for", type: "select", options: jobOptions },
    { name: "source", label: "Source", type: "select", options: SOURCES, default: "website" },
    { name: "stage", label: "Stage", type: "select", options: [...STAGES, "rejected"], default: "applied" },
    { name: "rating", label: "Rating (0-5)", type: "number", min: 0, max: 5 },
    { name: "expectedSalary", label: "Expected salary (AED)", type: "money" },
    { name: "noticePeriodDays", label: "Notice period (days)", type: "number" },
    { name: "resumeUrl", label: "Resume URL" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  const moveStage = (c) => {
    const idx = STAGES.indexOf(c.stage);
    if (idx >= 0 && idx < STAGES.length - 1) candidates.update({ id: c._id, stage: STAGES[idx + 1] });
  };

  const jobColumns = [
    { key: "title", header: "Position", render: (r) => (<div><p className="font-semibold text-gray-800 dark:text-white">{r.title}</p><p className="text-xs text-gray-400">{r.location || "—"} · {titleCase(r.employmentType)}</p></div>) },
    { key: "department", header: "Department", render: (r) => r.department?.name || "—" },
    { key: "openings", header: "Openings", render: (r) => r.openings },
    { key: "salary", header: "Salary Band", render: (r) => (r.minSalary || r.maxSalary ? `${fmtMoney(r.minSalary)} – ${fmtMoney(r.maxSalary)}` : "—") },
    { key: "applicants", header: "Applicants", render: (r) => candidates.items.filter((c) => c.job?._id === r._id || c.job === r._id).length },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader title="Recruitment & ATS" subtitle="Manage job openings and candidate pipeline" Icon={LuBriefcase} accent="#6366f1">
        {tab === "jobs" ? <SolidButton title="Post Job" Icon={LuPlus} onClick={() => { setEditingJob(null); setJobOpen(true); }} /> : <SolidButton title="Add Candidate" Icon={LuPlus} onClick={() => { setEditingCand(null); setCandOpen(true); }} />}
      </PageHeader>

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Open Positions" value={openJobs} Icon={LuBriefcase} accent="#6366f1" />
        <StatCard label="Candidates" value={candidates.items.length} Icon={LuUsers} accent="#0ea5e9" />
        <StatCard label="In Interview" value={inInterview} Icon={LuUserCheck} accent="#f59e0b" />
        <StatCard label="Hired" value={hired} Icon={LuUserCheck} accent="#10b981" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Hiring Funnel">
          <BarChart data={funnel} />
        </ChartCard>
        <ChartCard title="Candidate Sources">
          <DonutChart data={bySource} centerLabel="applicants" />
        </ChartCard>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Segmented value={tab} onChange={setTab} options={[{ value: "pipeline", label: "Pipeline" }, { value: "jobs", label: "Jobs" }]} />
      </div>

      {tab === "jobs" ? (
        <ResourceTable columns={jobColumns} rows={jobs.items} loading={jobs.loading} onEdit={(r) => { setEditingJob(r); setJobOpen(true); }} onDelete={(r) => window.confirm(`Delete job "${r.title}"?`) && jobs.remove(r._id)} emptyIcon={LuBriefcase} emptyTitle="No jobs posted" emptyHint="Post your first job opening." />
      ) : candidates.items.length === 0 && !candidates.loading ? (
        <EmptyState Icon={LuUsers} title="No candidates yet" hint="Add candidates to start building your pipeline." />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {STAGES.map((stage) => {
            const list = candidates.items.filter((c) => c.stage === stage);
            return (
              <div key={stage} className="rounded-2xl bg-gray-50 p-3 dark:bg-gray-800/40">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STAGE_ACCENT[stage] }} />{titleCase(stage)}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-700">{list.length}</span>
                </div>
                <div className="space-y-2">
                  {list.map((c) => (
                    <div key={c._id} className="group rounded-xl border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.name} size={30} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">{c.name}</p>
                          <p className="truncate text-xs text-gray-400">{c.job?.title || "General"}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="flex items-center gap-0.5 text-xs text-amber-500">{Array.from({ length: 5 }).map((_, i) => <LuStar key={i} size="0.7rem" fill={i < (c.rating || 0) ? "currentColor" : "none"} />)}</span>
                        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                          <button onClick={() => { setEditingCand(c); setCandOpen(true); }} className="rounded p-1 text-gray-400 hover:text-blue-600" title="Edit">✎</button>
                          {stage !== "hired" && <button onClick={() => moveStage(c)} className="rounded p-1 text-gray-400 hover:text-emerald-600" title="Advance stage"><LuChevronRight size="0.9rem" /></button>}
                          <button onClick={() => window.confirm("Remove candidate?") && candidates.remove(c._id)} className="rounded p-1 text-gray-400 hover:text-rose-600"><LuTrash2 size="0.85rem" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {list.length === 0 && <p className="py-4 text-center text-xs text-gray-300 dark:text-gray-600">Empty</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ResourceFormDrawer open={jobOpen} onClose={() => setJobOpen(false)} title={editingJob ? "Edit Job" : "Post Job"} fields={jobFields} editing={editingJob} submitting={jobs.submitting} onSubmit={editingJob ? jobs.update : jobs.create} />
      <ResourceFormDrawer open={candOpen} onClose={() => setCandOpen(false)} title={editingCand ? "Edit Candidate" : "Add Candidate"} fields={candFields} editing={editingCand} submitting={candidates.submitting} onSubmit={editingCand ? candidates.update : candidates.create} />
    </>
  );
};

export default Recruitment;
