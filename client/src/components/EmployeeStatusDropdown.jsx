import React, { useMemo } from "react";
import SearchableDropdown from "./SearchDropdown";
import { useDebouncedState } from "src/hooks/useDebounce";
import useEmployees from "src/API/hooks/useEmployees";

const EmployeeStatusDropdown = ({ value, setter, required }) => {
  const [searchKey, setSearchKey] = useDebouncedState("", 1000);
  const status = [
    { label: "Active", _id: "active" },
    { label: "Inactive", _id: "inactive" },
    { label: "Resigned", _id: "resigned" },
    { label: "Terminated", _id: "terminated" },
  ];

  const getDisplayValue = (item) => `${item?.label}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = status.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value]);

  return <SearchableDropdown getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={searchKey} setSearchKey={setSearchKey} results={status} loading={false} error={null} label={"Status"} required={required} />;
};

export default EmployeeStatusDropdown;
