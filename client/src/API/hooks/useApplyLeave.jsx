import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useApplyLeave = (leaveType, fromDate, toDate, reason, onCreate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.leave.request]);
  const [error, setError] = useState({});

  const handleApplyLeave = async () => {
    const { success, result } = validator(leaveType, fromDate, toDate, reason);
    console.log({ success, result });
    if (success) {
      const res = await API.leave.request(result);
      if (res.success) {
        dispatchSnackbar("Leave applied Successfully", snackBarTypes.success);
        onCreate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [leaveType, fromDate, toDate, reason]);

  return { handleApplyLeave, error, loading };
};

const validator = (leaveType, fromDate, toDate, reason) => {
  const isInvalid = {};
  const body = {};

  if (validateStringLength(leaveType, 1, 20)) {
    body.leaveType = leaveType;
  } else {
    isInvalid.leaveType = "Invalid leave Type";
  }
  if (validateTimestamp(fromDate)) {
    body.fromDate = fromDate;
  } else {
    isInvalid.fromDate = "Invalid Start Date";
  }
  if (validateTimestamp(toDate)) {
    body.toDate = toDate;
  } else {
    isInvalid.toDate = "Invalid End date";
  }
  if (reason) {
    if (validateStringLength(reason, 1, 256)) {
      body.reason = reason;
    } else {
      isInvalid.reason = "Reason can be max 256 characters";
    }
  }

  return handleValidationError(isInvalid, body);
};

export default useApplyLeave;
