import React, { useMemo } from "react";
import SearchableDropdown from "./SearchDropdown";
import useLeaveBalance from "src/API/hooks/useLeaveBalance";

const LeaveTypeDropdown = ({ value, setter, label = "Leave Type", required = false }) => {
  const { leaveBalances, loading, error } = useLeaveBalance();

  const leaves = useMemo(() => leaveBalances?.leaveBalances?.map((l) => ({ _id: l?.leaveType, value: l?.leaveType, label: l?.leaveType, carryForwarded: l?.carryForwarded, credited: l?.credited, used: l?.used })), [leaveBalances]);

  const getDisplayValue = (item) => `${item?.label} - Balance - ${item?.credited + item?.carryForwarded - item?.used}`;

  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = leaves.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value, leaves]);

  return <SearchableDropdown getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={""} setSearchKey={() => null} results={leaves} loading={loading} error={Object.values(error)?.[0]} label={label} required={required} />;
};

export default LeaveTypeDropdown;
