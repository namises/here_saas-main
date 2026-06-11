import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useFinancialYears = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const loading = useSelector((s) => s.apiStatus[endpoints.financialYear.list]);

  const handleListFinancialYears = async () => {
    const res = await API.financialYear.list();
    if (res.success) {
      setFinancialYears(res.data.financialYears);
    }
  };

  useEffect(() => {
    handleListFinancialYears();
  }, []);

  return { financialYears, loading };
};

export default useFinancialYears;
