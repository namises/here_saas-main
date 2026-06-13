import React, { useEffect, useState } from "react";
import { LuChartColumnBig, LuUsers, LuBriefcase, LuShieldCheck } from "react-icons/lu";
import { API } from "src/API/api";
import { BarChart, ChartCard, DonutChart, LineChart } from "src/components/charts";
import { PageHeader } from "src/components/resource/Bits";
import { fmtMoney } from "src/utils/ui";

const SectionTitle = ({ Icon, children }) => (
  <h2 className="mb-3 mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
    <Icon className="text-gray-400" /> {children}
  </h2>
);

const Reports = () => {
  const [overview, setOverview] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [o, r] = await Promise.all([API.analytics.overview(), API.analytics.headcount()]);
      setOverview(o?.data?.overview || null);
      setReport(r?.data?.report || null);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <>
        <PageHeader title="Reports & Analytics" subtitle="Cross-module insights" Icon={LuChartColumnBig} accent="#3b82f6" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      </>
    );

  return (
    <>
      <PageHeader title="Reports & Analytics" subtitle="Cross-module insights across the organization" Icon={LuChartColumnBig} accent="#3b82f6" />

      <SectionTitle Icon={LuUsers}>Workforce</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Headcount by Department"><BarChart horizontal data={report?.byDepartment || []} /></ChartCard>
        <ChartCard title="By Designation"><DonutChart data={report?.byDesignation || []} centerLabel="staff" /></ChartCard>
        <ChartCard title="Joining Trend" subtitle="New hires per month" className="lg:col-span-2"><LineChart data={report?.joinTrend || []} color="#10b981" /></ChartCard>
      </div>

      <SectionTitle Icon={LuBriefcase}>Operations</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Attendance Trend" subtitle="Present headcount"><LineChart data={overview?.attendanceTrend || []} color="#3b82f6" /></ChartCard>
        <ChartCard title="Hiring Funnel"><BarChart data={overview?.recruitmentFunnel || []} /></ChartCard>
        <ChartCard title="Expense by Category" subtitle="AED" className="lg:col-span-2"><BarChart horizontal data={overview?.expenseByCategory || []} formatValue={(v) => fmtMoney(v)} /></ChartCard>
      </div>

      <SectionTitle Icon={LuShieldCheck}>Compliance & Assets</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="UAE Compliance Status"><DonutChart data={overview?.complianceStatus || []} centerLabel="documents" /></ChartCard>
        <ChartCard title="Assets by Status"><DonutChart data={overview?.assetsByStatus || []} centerLabel="assets" /></ChartCard>
      </div>
    </>
  );
};

export default Reports;
