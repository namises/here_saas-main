import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateFinancialYear, validateObjectId, validateRangeNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useUpdateCTC = (ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom, onUpdate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.ctc.update]);
  const [error, setError] = useState({});
  const handleUpdateCTC = async () => {
    const { success, result } = validator(ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom);
    if (success) {
      const res = await API.ctc.update(result);
      if (res.success) {
        onUpdate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom]);

  return { handleUpdateCTC, error, loading };
};

const validator = (ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom) => {
  const isInvalid = {};
  const body = {};
  if (validateObjectId(ctcId)) {
    body.ctcId = ctcId;
  } else {
    isInvalid.ctcId = "Invalid CTC Id";
  }
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

export default useUpdateCTC;
