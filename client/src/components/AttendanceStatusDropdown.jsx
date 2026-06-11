import React, { useMemo } from "react";
import SearchableDropdown from "./SearchDropdown";
import { useDebouncedState } from "src/hooks/useDebounce";

const AttendanceStatusDropdown = ({ value, setter, required, error }) => {
  const [searchKey, setSearchKey] = useDebouncedState("", 1000);
  const status = [
    { label: "Present", _id: "present" },
    { label: "Half Day", _id: "half-day" },
    { label: "Absent", _id: "absent" },
    { label: "Leave", _id: "leave" },
    { label: "Holiday", _id: "holiday" },
    { label: "Week Off", _id: "week_off" },
  ];

  const getDisplayValue = (item) => `${item?.label}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = status.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value]);

  return <SearchableDropdown getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={searchKey} setSearchKey={setSearchKey} results={status} loading={false} error={error} label={"Status"} required={required} />;
};

export default AttendanceStatusDropdown;
