import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateRangeNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useDownloadPayslip = () => {
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.payroll.paySlip]);

  const downLoadPayslip = async (payrollId) => {
    const { success, result } = validator(payrollId);
    if (success) {
      const res = await API.payroll.paySlip(result);
      if (res) {
        const file = new Blob([res], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `payslip_${payrollId}.pdf`;
        link.click();
        URL.revokeObjectURL(fileURL);
      }
    } else {
      setError({ ...result });
    }
  };

  return { loading, error, downLoadPayslip };
};

const validator = (payrollId) => {
  const isInvalid = {};
  const body = {};

  if (validateObjectId(payrollId)) {
    body.payrollId = payrollId;
  } else {
    isInvalid.payrollId = "Payroll id must be an Object Id";
  }

  return handleValidationError(isInvalid, body);
};

export default useDownloadPayslip;
