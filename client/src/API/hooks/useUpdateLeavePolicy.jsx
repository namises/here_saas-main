import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateRangeNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useUpdateLeavePolicy = (leavePolicyId, leaveType, code, description, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable, onCreate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.leave.policy.update]);
  const [error, setError] = useState({});
  const handleUpdateLeavePolicy = async () => {
    const { success, result } = validator(leavePolicyId, leaveType, code, description, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable);
    if (success) {
      const res = await API.leave.policy.update(result);
      if (res.success) {
        onCreate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [leavePolicyId, leaveType, code, description, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable]);

  return { handleUpdateLeavePolicy, error, loading };
};

const validator = (leavePolicyId, leaveType, code, description, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable) => {
  const isInvalid = {};
  const body = {};

  if (validateObjectId(leavePolicyId)) {
    body.leavePolicyId = leavePolicyId;
  } else {
    isInvalid.leavePolicyId = "Leave Policy ID is required";
  }
  if (validateStringLength(leaveType, 2, 64)) {
    body.leaveType = leaveType;
  } else {
    isInvalid.leaveType = "Leave type must be 2-64 characters";
  }
  if (validateStringLength(code, 2, 16)) {
    body.code = code;
  } else {
    isInvalid.code = "Code must be 2-16 characters";
  }
  if (description) {
    if (validateStringLength(description, 1, 256)) {
      body.description = description;
    } else {
      isInvalid.description = "Description can be 1-256 characters";
    }
  }
  if (description) {
    if (validateStringLength(description, 1, 256)) {
      body.description = description;
    } else {
      isInvalid.description = "Description can be 1-256 characters";
    }
  }
  if (validateRangeNumber(maxPerYear, 1, 365)) {
    body.maxPerYear = maxPerYear;
  } else {
    isInvalid.maxPerYear = "Max leave count can be 365";
  }
  if (accrualFrequency && ["monthly", "quarterly", "annually"].includes(accrualFrequency)) {
    body.accrualFrequency = accrualFrequency;
  } else {
    isInvalid.accrualFrequency = "Accural frequency is required";
  }
  if (applicableAfterMonths) {
    if (validateRangeNumber(applicableAfterMonths, 0, 12)) {
      body.applicableAfterMonths = applicableAfterMonths;
    } else {
      isInvalid.applicableAfterMonths = "Applicable after month can be maximum 12 months";
    }
  }
  body.carryForward = carryForward;
  if (carryForward) {
    if (validateRangeNumber(maxCarryForward, 0, maxPerYear)) {
      body.maxCarryForward = maxCarryForward;
    } else {
      isInvalid.maxCarryForward = "Max carry forward count is required";
    }
  }
  body.encashable = encashable;
  if (encashable) {
    if (validateRangeNumber(maxEncashable, 0, maxPerYear)) {
      body.maxEncashable = maxEncashable;
    } else {
      isInvalid.maxEncashable = "Encashable count is required";
    }
  }
  return handleValidationError(isInvalid, body);
};

export default useUpdateLeavePolicy;
