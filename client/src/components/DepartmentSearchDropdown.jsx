import React, { useMemo } from "react";
import SearchableDropdown from "./SearchDropdown";
import useDepartments from "src/API/hooks/useDepartments";
import { useDebouncedState } from "src/hooks/useDebounce";

const DepartmentSearchDropdown = ({ value, setter, label, required, disabled }) => {
  const [searchKey, setSearchKey] = useDebouncedState("", 1000);
  const { departments, totalPages, pageno, setpageNo, loading, next, fetch, error } = useDepartments(1, 10, searchKey, searchKey, searchKey);

  const getDisplayValue = (item) => `${item?.name}-${item?.code}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = departments.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value, departments]);

  return <SearchableDropdown disabled={disabled} className="w-full" getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={searchKey} setSearchKey={setSearchKey} results={departments} loading={loading} error={Object.values(error)?.[0]} label={label || "Department"} required={required} />;
};

export default DepartmentSearchDropdown;
