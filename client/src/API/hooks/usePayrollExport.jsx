import { useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateFinancialYear, validateObjectId } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const usePayrollExport = (employee, month, status, financialYear) => {
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.payroll.list]);

  const exportPayroll = async () => {
    const { success, result } = validator(employee, month, status, financialYear);
    if (success) {
      const res = await API.payroll.export(result);
      if (res) {
        const file = new Blob([res], { type: "text/csv" });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `payroll_report_${new Date()}.csv`;
        link.click();
        URL.revokeObjectURL(fileURL);
      }
    } else {
      setError({ ...result });
    }
  };

  return { exportPayroll, loading, error };
};

const validator = (employee, month, status, financialYear) => {
  const isInvalid = {};
  const body = {};

  if (employee) {
    if (validateObjectId(employee)) {
      body.employee = employee;
    } else {
      isInvalid.employee = "Invalid Value provided";
    }
  }
  if (status) {
    if (["pending", "processed"].includes(status)) {
      body.status = status;
    } else {
      isInvalid.status = `Status must be one of the following: "pending", "processed"`;
    }
  }
  if (month) {
    if (["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].includes(month)) {
      body.month = month;
    } else {
      isInvalid.month = `Invalid Month`;
    }
  }
  if (financialYear) {
    if (validateFinancialYear(financialYear)) {
      body.financialYear = financialYear;
    } else {
      isInvalid.financialYear = `Invalid Financial year`;
    }
  }

  return handleValidationError(isInvalid, body);
};

export default usePayrollExport;
