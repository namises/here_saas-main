import React, { useMemo, useState } from "react";
import SearchableDropdown from "./SearchDropdown";

const MonthDropdown = ({ value, setter, label, required, disabled }) => {
  const [months] = useState([
    { _id: "January", label: "January", value: "January" },
    { _id: "February", label: "February", value: "February" },
    { _id: "March", label: "March", value: "March" },
    { _id: "April", label: "April", value: "April" },
    { _id: "May", label: "May", value: "May" },
    { _id: "June", label: "June", value: "June" },
    { _id: "July", label: "July", value: "July" },
    { _id: "August", label: "August", value: "August" },
    { _id: "September", label: "September", value: "September" },
    { _id: "October", label: "October", value: "October" },
    { _id: "November", label: "November", value: "November" },
    { _id: "December", label: "December", value: "December" },
  ]);

  const getDisplayValue = (item) => `${item?.label}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = months.find((item) => item._id === value);

    return item ? getDisplayValue(item) : null;
  }, [value, months]);

  console.log({ selectedItemDisplay });
  return <SearchableDropdown disabled={disabled} className="w-full" getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={""} setSearchKey={() => null} results={months} loading={false} error={null} label={label || "Month"} required={required} />;
};

export default MonthDropdown;
