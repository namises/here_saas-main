import React, { useState } from "react";
import { Button } from "flowbite-react";
import { LuPlus, LuCalendarX2 } from "react-icons/lu";
import ApplyLeaveForm from "src/components/ApplyLeaveForm";
import useLeave from "src/API/hooks/useLeave";
import useLeaveBalance from "src/API/hooks/useLeaveBalance";
import { useSelector } from "react-redux";
import { fmtDate, statusClass, titleCase } from "src/utils/ui";

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass(status)}`}>{status}</span>
);

const MyLeaves = () => {
  const user = useSelector((s) => s.user);
  const [applyOpen, setApplyOpen] = useState(false);
  const { leaveBalances, loading: balLoading } = useLeaveBalance(user?._id);
  const { leaves, loading, getLeaves } = useLeave();

  // Re-fetch when the apply drawer closes (covers a freshly submitted request).
  const handleSetApplyOpen = (val) => {
    setApplyOpen(val);
    if (val === false) {
      getLeaves();
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Leaves</h1>
          <p className="text-sm text-gray-400">Apply for leave and track approval status.</p>
        </div>
        <Button color="blue" onClick={() => setApplyOpen(true)}>
          <LuPlus className="mr-2" /> Apply
        </Button>
      </div>

      {/* Balances */}
      <p className="mb-2 text-sm font-semibold text-gray-500">Balances</p>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {balLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)
        ) : leaveBalances.length === 0 ? (
          <p className="col-span-full rounded-xl bg-white p-4 text-sm text-gray-400 dark:bg-gray-800">No leave balances allocated yet.</p>
        ) : (
          leaveBalances.map((b) => {
            const available = Math.max(0, (b.credited || 0) + (b.carryForwarded || 0) - (b.used || 0));
            return (
              <div key={b.code} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <p className="truncate text-xs font-medium text-gray-400">{titleCase(b.leaveType)}</p>
                <p className="mt-1 text-3xl font-bold text-gray-800 dark:text-white">{available}</p>
                <p className="text-xs text-gray-400">
                  {b.used || 0} used / {(b.credited || 0) + (b.carryForwarded || 0)} total
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* History */}
      <p className="mb-2 text-sm font-semibold text-gray-500">History</p>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700" />
            ))}
          </div>
        ) : leaves.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-gray-300">
            <LuCalendarX2 size="2rem" />
            <p className="text-sm">No leave requests yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {leaves.map((l) => (
              <li key={l._id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {titleCase(l.leaveType)}
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700">{l.days} day{l.days > 1 ? "s" : ""}</span>
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {fmtDate(l.fromDate)} → {fmtDate(l.toDate)}
                    {l.reason ? ` · ${l.reason}` : ""}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <ApplyLeaveForm isOpen={applyOpen} setIsOpen={handleSetApplyOpen} getLeaveAplications={getLeaves} />
    </div>
  );
};

export default MyLeaves;
