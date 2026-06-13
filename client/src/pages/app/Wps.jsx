import React, { useMemo, useState } from "react";
import { LuLandmark, LuFileSpreadsheet, LuUsers, LuWallet, LuDownload, LuTrash2, LuZap } from "react-icons/lu";
import useResource from "src/API/hooks/useResource";
import { ChartCard, BarChart, groupSum } from "src/components/charts";
import StatCard from "src/components/charts/StatCard";
import { PageHeader, StatusBadge, EmptyState } from "src/components/resource/Bits";
import ResourceTable from "src/components/resource/ResourceTable";
import { fmtMoney, fmtDate } from "src/utils/ui";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const downloadText = (filename, text) => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "wps.sif";
  a.click();
  URL.revokeObjectURL(url);
};

const inputCls = "w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

const Wps = () => {
  const { items, loading, remove, api, refetch } = useResource({ name: "wps", listKey: "batches" });
  const [form, setForm] = useState({ month: new Date().toISOString().slice(0, 7), employerId: "", bankRoutingCode: "", financialYear: "" });
  const [generating, setGenerating] = useState(false);

  const amountByMonth = useMemo(() => groupSum(items, "month", "totalAmount"), [items]);
  const latest = items[0];
  const submitted = items.filter((b) => ["submitted", "accepted"].includes(b.status)).length;

  const onGenerate = async () => {
    if (!form.month) return dispatchSnackbar("Select a salary month", snackBarTypes.error);
    setGenerating(true);
    const res = await api.generate(form);
    setGenerating(false);
    if (res?.success) {
      dispatchSnackbar(`WPS batch generated · ${res.data.batch?.totalRecords || 0} employees`, snackBarTypes.success);
      if (res.data.sifContent) downloadText(res.data.sifFileName, res.data.sifContent);
      refetch();
    }
  };

  const onDownload = async (id) => {
    const res = await api.download({ id });
    if (res?.success) downloadText(res.data.sifFileName, res.data.sifContent);
  };

  const columns = [
    { key: "month", header: "Salary Month", render: (r) => <span className="font-semibold text-gray-800 dark:text-white">{r.month}</span> },
    { key: "totalRecords", header: "Employees", render: (r) => r.totalRecords },
    { key: "totalAmount", header: "Total Payout", render: (r) => <span className="font-semibold">{fmtMoney(r.totalAmount, r.currency)}</span> },
    { key: "sifFileName", header: "SIF File", render: (r) => <span className="font-mono text-xs text-gray-500">{r.sifFileName}</span> },
    { key: "createdAt", header: "Generated", render: (r) => fmtDate(r.createdAt) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "dl", header: "", render: (r) => (<button onClick={() => onDownload(r._id)} className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-gray-700 dark:text-blue-400"><LuDownload size="0.85rem" /> SIF</button>) },
  ];

  return (
    <>
      <PageHeader title="WPS Payroll Compliance" subtitle="Generate UAE Wage Protection System (SIF) files" Icon={LuLandmark} accent="#0ea5e9" />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Batches" value={items.length} Icon={LuFileSpreadsheet} accent="#0ea5e9" />
        <StatCard label="Last Batch Employees" value={latest?.totalRecords || 0} Icon={LuUsers} accent="#8b5cf6" />
        <StatCard label="Last Batch Payout" value={fmtMoney(latest?.totalAmount || 0)} Icon={LuWallet} accent="#10b981" />
        <StatCard label="Submitted" value={submitted} Icon={LuLandmark} accent="#f59e0b" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100"><LuZap className="text-amber-500" /> Generate SIF</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Salary month</label>
              <input type="month" className={inputCls} value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">MOHRE Establishment ID</label>
              <input className={inputCls} placeholder="Employer ID" value={form.employerId} onChange={(e) => setForm({ ...form, employerId: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Bank routing code</label>
              <input className={inputCls} placeholder="Agent/Bank code" value={form.bankRoutingCode} onChange={(e) => setForm({ ...form, bankRoutingCode: e.target.value })} />
            </div>
            <button onClick={onGenerate} disabled={generating} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60">
              {generating ? "Generating…" : (<><LuFileSpreadsheet size="1rem" /> Generate & Download SIF</>)}
            </button>
            <p className="text-xs text-gray-400">Pulls active employees and their latest payroll / CTC to build the Salary Information File.</p>
          </div>
        </div>
        <ChartCard title="Payout by Month" subtitle="AED" className="lg:col-span-2">
          <BarChart data={amountByMonth} formatValue={(v) => fmtMoney(v)} />
        </ChartCard>
      </div>

      {items.length === 0 && !loading ? (
        <EmptyState Icon={LuLandmark} title="No WPS batches yet" hint="Generate your first SIF file above." />
      ) : (
        <ResourceTable columns={columns} rows={items} loading={loading} onDelete={(r) => window.confirm(`Delete WPS batch for ${r.month}?`) && remove(r._id)} />
      )}
    </>
  );
};

export default Wps;
