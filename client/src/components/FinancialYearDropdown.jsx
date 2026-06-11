import React, { useMemo, useState } from "react";
import SearchableDropdown from "./SearchDropdown";
import useFinancialYears from "src/API/hooks/useFinancialYears";

const FinancialYearDropdown = ({ value, setter, label, required, disabled }) => {
  const [searchKey, setSearchKey] = useState("");
  const { financialYears, loading: loadingFinancialYears } = useFinancialYears();

  const results = useMemo(() => financialYears.map((v) => ({ label: v, value: v, _id: v })), [financialYears]);
  const getDisplayValue = (item) => `${item?.label}`;
  const selectedItemDisplay = useMemo(() => {
    if (!value) return null;
    const item = results.find((item) => item._id === value);
    return item ? getDisplayValue(item) : null;
  }, [value, results]);

  return <SearchableDropdown disabled={disabled} className="w-full" getDisplayValue={getDisplayValue} selectedItemDisplay={selectedItemDisplay} value={value} setter={setter} searchKey={searchKey} setSearchKey={setSearchKey} results={results} loading={loadingFinancialYears} error={null} label={label || "Financial Year"} required={required} />;
};

export default FinancialYearDropdown;
