import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuUsers, LuBuilding2, LuBriefcase, LuReceipt, LuGitPullRequestArrow, LuCalendarX2, LuArrowRight, LuMegaphone } from "react-icons/lu";
import { API } from "src/API/api";
import { BarChart, ChartCard, DonutChart, LineChart } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { Avatar } from "src/components/resource/Bits";
import { ROUTES } from "src/utils/constants";
import { fmtMoney, relativeTime, titleCase } from "src/utils/ui";

const quickLinks = [
  { label: "Recruitment", to: ROUTES.APP.RECRUITMENT, Icon: LuBriefcase, accent: "#6366f1" },
  { label: "Expenses", to: ROUTES.APP.EXPENSES, Icon: LuReceipt, accent: "#f59e0b" },
  { label: "Approvals", to: ROUTES.APP.APPROVALS, Icon: LuGitPullRequestArrow, accent: "#0ea5e9" },
  { label: "Compliance", to: ROUTES.APP.COMPLIANCE, Icon: LuBuilding2, accent: "#10b981" },
];

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await API.analytics.overview();
      setData(res?.data?.overview || null);
      setLoading(false);
    })();
  }, []);

  const k = data?.kpis || {};

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back 👋</h1>
        <p className="text-sm text-gray-400">Here's what's happening across your organization today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Employees" value={k.employees ?? 0} Icon={LuUsers} accent="#3b82f6" />
            <StatCard label="Branches" value={k.branches ?? 0} Icon={LuBuilding2} accent="#0ea5e9" />
            <StatCard label="Open Positions" value={k.openJobs ?? 0} Icon={LuBriefcase} accent="#6366f1" />
            <StatCard label="Departments" value={k.departments ?? 0} Icon={LuBuilding2} accent="#8b5cf6" />
            <StatCard label="Pending Approvals" value={k.pendingApprovals ?? 0} Icon={LuGitPullRequestArrow} accent="#f59e0b" />
            <StatCard label="Pending Expenses" value={fmtMoney(k.expensePending ?? 0)} Icon={LuReceipt} accent="#ef4444" />
            <StatCard label="On Leave (pending)" value={k.pendingLeaves ?? 0} Icon={LuCalendarX2} accent="#ec4899" />
            <StatCard label="Asset Value" value={fmtMoney(k.assetValue ?? 0)} Icon={LuBuilding2} accent="#10b981" />
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartCard title="Attendance Trend" subtitle="Present headcount over time" className="lg:col-span-2">
              <LineChart data={data?.attendanceTrend || []} color="#3b82f6" height={240} />
            </ChartCard>
            <ChartCard title="Workforce" subtitle="By status">
              <DonutChart data={(data?.employeesByStatus || []).map((d) => ({ ...d, label: titleCase(d.label) }))} centerLabel="staff" size={150} thickness={18} />
            </ChartCard>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartCard title="Hiring Funnel"><BarChart data={data?.recruitmentFunnel || []} height={200} /></ChartCard>
            <ChartCard title="Expense by Category" subtitle="AED"><DonutChart data={data?.expenseByCategory || []} size={150} thickness={18} centerLabel="AED" /></ChartCard>
            <ChartCard title="UAE Compliance"><DonutChart data={data?.complianceStatus || []} size={150} thickness={18} centerLabel="docs" /></ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <ChartCard title="Announcements" className="lg:col-span-2">
              {(data?.announcements || []).length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-300 dark:text-gray-600">No announcements yet</p>
              ) : (
                <div className="space-y-3">
                  {data.announcements.map((a) => (
                    <div key={a._id} className="flex items-start gap-3 border-b border-gray-50 pb-3 last:border-0 dark:border-gray-700/50">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-500 dark:bg-pink-900/30"><LuMegaphone size="1.1rem" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">{a.title}<span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] capitalize text-gray-500 dark:bg-gray-700">{a.category}</span></p>
                        <p className="line-clamp-1 text-xs text-gray-400">{a.body}</p>
                      </div>
                      <span className="shrink-0 text-xs text-gray-300">{relativeTime(a.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>

            <ChartCard title="Quick Actions">
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((q) => (
                  <Link key={q.label} to={q.to} className="group flex flex-col gap-2 rounded-xl border border-gray-100 p-4 transition hover:border-blue-200 hover:shadow-sm dark:border-gray-700">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${q.accent}1a`, color: q.accent }}><q.Icon size="1.2rem" /></span>
                    <span className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200">{q.label}<LuArrowRight className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500" size="0.9rem" /></span>
                  </Link>
                ))}
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
