import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateFinancialYear, validateObjectId, validateRangeNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useCreateCTC = (employee, financialYear, earnings, deductions, remarks, effectiveFrom, onCreate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.ctc.create]);
  const [error, setError] = useState({});
  const handleCreateCTC = async () => {
    const { success, result } = validator(employee, financialYear, earnings, deductions, remarks, effectiveFrom);
    if (success) {
      const res = await API.ctc.create(result);
      if (res.success) {
        onCreate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [employee, financialYear, earnings, deductions, remarks, effectiveFrom]);

  return { handleCreateCTC, error, loading };
};

const validator = (employee, financialYear, earnings, deductions, remarks, effectiveFrom) => {
  const isInvalid = {};
  const body = {};
  if (validateObjectId(employee)) {
    body.employee = employee;
  } else {
    isInvalid.employee = "Invalid Employee Id";
  }
  if (validateFinancialYear(financialYear)) {
    body.financialYear = financialYear;
  } else {
    isInvalid.financialYear = "Invalid Financial Year";
  }
  if (remarks) {
    if (validateStringLength(remarks, 1, 256)) {
      body.remarks = remarks;
    } else {
      isInvalid.remarks = "remarks can be 1-256 characters";
    }
  }
  if (validateTimestamp(effectiveFrom)) {
    body.effectiveFrom = effectiveFrom;
  } else {
    isInvalid.effectiveFrom = "Invalid Date";
  }
  if (earnings && Array.isArray(earnings) && earnings.length) {
    const invalidearnings = earnings.filter((c) => {
      return !(c.name && validateRangeNumber(c.annualAmount, 1, 10000000000000) && c.type && c.type === "earnings" && (c.inHandComponent === true || c.inHandComponent === false));
    });
    if (invalidearnings.length > 0) {
      isInvalid.earnings = "One or more earnings are Invalid";
    } else {
      body.earnings = earnings;
    }
  } else {
    isInvalid.earnings = "earnings are required";
  }
  if (deductions && Array.isArray(deductions) && deductions.length) {
    const invaliddeductions = deductions.filter((c) => {
      return !(c.name && validateRangeNumber(c.annualAmount, 1, 10000000000000) && c.type && c.type === "deductions" && (c.inHandComponent === true || c.inHandComponent === false));
    });
    if (invaliddeductions.length > 0) {
      isInvalid.deductions = "One or more deductions are Invalid";
    } else {
      body.deductions = deductions;
    }
  }

  return handleValidationError(isInvalid, body);
};

export default useCreateCTC;
