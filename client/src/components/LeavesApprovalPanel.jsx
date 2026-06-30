import React, { useMemo } from "react";
import { LuCheck, LuX, LuCalendarX2, LuBadgeCheck } from "react-icons/lu";
import useLeave from "src/API/hooks/useLeave";
import useLeaveApprove from "src/API/hooks/useLeaveApprove";
import useLeaveReject from "src/API/hooks/useLeaveReject";
import { StatusBadge, Avatar, EmptyState } from "src/components/resource/Bits";
import { fmtDate, titleCase } from "src/utils/ui";

// "Leaves" section for the Approvals page: real leave requests with an approver badge + approve/reject.
const LeavesApprovalPanel = () => {
  const { leaves, loading, getLeaves } = useLeave();
  const { approve, loading: approving } = useLeaveApprove(getLeaves);
  const { reject, loading: rejecting } = useLeaveReject(getLeaves);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    (leaves || []).forEach((l) => { if (c[l.status] != null) c[l.status] += 1; });
    return c;
  }, [leaves]);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Pending {counts.pending}</span>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Approved {counts.approved}</span>
        <span className="rounded-full bg-rose-100 px-2.5 py-1 font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Rejected {counts.rejected}</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}</div>
      ) : !leaves || leaves.length === 0 ? (
        <EmptyState Icon={LuCalendarX2} title="No leave requests" hint="Leave applications will appear here for approval." />
      ) : (
        <div className="space-y-3">
          {leaves.map((l) => (
            <div key={l._id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{l.employee?.name || "Employee"}</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-500 dark:bg-gray-700">{titleCase(l.leaveType || "leave")}</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">{l.days} day{l.days > 1 ? "s" : ""}</span>
                    <StatusBadge status={l.status} />
                    {/* Who actioned the leave */}
                    {l.status !== "pending" && l.approvedBy?.name ? (
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${l.status === "approved" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" : "bg-rose-50 text-rose-600 dark:bg-rose-900/30"}`}>
                        <LuBadgeCheck size="0.8rem" /> {l.status === "approved" ? "Approved" : "Rejected"} by {l.approvedBy.name}
                      </span>
                    ) : null}
                  </div>
                  {l.reason ? <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{l.reason}</p> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {l.employee?.name ? <span className="flex items-center gap-1.5"><Avatar name={l.employee.name} size={20} /> {l.employee.name}</span> : null}
                    <span>{fmtDate(l.fromDate)} → {fmtDate(l.toDate)}</span>
                    {l.actionedAt ? <span>actioned {fmtDate(l.actionedAt)}</span> : null}
                  </div>
                </div>
                {l.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => approve(l._id)} disabled={approving} className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50">
                      <LuCheck size="0.9rem" /> Approve
                    </button>
                    <button onClick={() => reject(l._id)} disabled={rejecting} className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-50">
                      <LuX size="0.9rem" /> Reject
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LeavesApprovalPanel;
