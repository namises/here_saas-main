import React, { useMemo } from "react";
import SearchableDropdown from "./SearchDropdown";
import { useDebouncedState } from "src/hooks/useDebounce";
import useEmployees from "src/API/hooks/useEmployees";

const EmployeeSearchDropdown = ({ value, setter, label, disabled }) => {
  const [searchKey, setSearchKey] = useDebouncedState("", 1000);
  const { employees, loading, error } = useEmployees(searchKey, searchKey, null, searchKey, searchKey, null, searchKey, null, null);

  const getDisplayValue = (item) => `${item?.name}-${item?.email}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = employees.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value, employees]);

  return <SearchableDropdown disabled={disabled} getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={searchKey} setSearchKey={setSearchKey} results={employees} loading={loading} error={Object.values(error)?.[0]} label={label} required={true} />;
};

export default EmployeeSearchDropdown;
