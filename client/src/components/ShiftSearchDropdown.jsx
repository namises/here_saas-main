import React, { useMemo } from "react";
import SearchableDropdown from "./SearchDropdown";
import { useDebouncedState } from "src/hooks/useDebounce";
import useEmployees from "src/API/hooks/useEmployees";
import useShift from "src/API/hooks/useShift";

const ShiftSearchDropdown = ({ value, setter }) => {
  const [searchKey, setSearchKey] = useDebouncedState("", 1000);
  const { shifts: _shifts, loading, error } = useShift();

  const shifts = useMemo(() => (searchKey.length ? _shifts.filter(({ name }) => name.toLowerCase().includes(searchKey.toLowerCase())) : [..._shifts]), [searchKey, _shifts]);

  const getDisplayValue = (item) => `${item?.name} ${item?.startTime}-${item?.endTime}`;

  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = shifts.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value, shifts]);

  return <SearchableDropdown getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={searchKey} setSearchKey={setSearchKey} results={shifts} loading={loading} error={Object.values(error)?.[0]} label={"Shift"} required={true} />;
};

export default ShiftSearchDropdown;
