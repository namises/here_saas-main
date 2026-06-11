import React, { useMemo } from "react";
import SearchableDropdown from "./SearchDropdown";
import { useDebouncedState } from "src/hooks/useDebounce";
import useEmployees from "src/API/hooks/useEmployees";

const LeaveAccuralFrequencyDropdown = ({ value, setter, required, error }) => {
  const [searchKey, setSearchKey] = useDebouncedState("", 1000);
  const status = [
    { label: "Monthly", _id: "monthly" },
    { label: "Quarterly", _id: "quarterly" },
    { label: "Annually", _id: "annually" },
  ];

  const getDisplayValue = (item) => `${item?.label}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = status.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value]);

  return <SearchableDropdown getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={searchKey} setSearchKey={setSearchKey} results={status} loading={false} error={error} label={"Accural Frequency"} required={required} />;
};

export default LeaveAccuralFrequencyDropdown;
