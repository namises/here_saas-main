import React, { useMemo, useState } from "react";
import SearchableDropdown from "./SearchDropdown";

const PayrollStatusDropdown = ({ value, setter, label, required, disabled }) => {
  const [payrollStatus] = useState([
    { _id: "pending", label: "Pending", value: "pending" },
    { _id: "processed", label: "Processed", value: "processed" },
  ]);

  const getDisplayValue = (item) => `${item?.label}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = payrollStatus.find((item) => item._id === value);

    return item ? getDisplayValue(item) : null;
  }, [value, payrollStatus]);

  console.log({ selectedItemDisplay });
  return <SearchableDropdown disabled={disabled} className="w-full" getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={""} setSearchKey={() => null} results={payrollStatus} loading={false} error={null} label={label || "Status"} required={required} />;
};

export default PayrollStatusDropdown;
