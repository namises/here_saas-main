import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useUpdateLeave = (leaveId, leaveType, fromDate, toDate, reason, onUpdate = () => null) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.leave.update]);
  const [error, setError] = useState({});

  const handleUpdateLeave = async () => {
    const { success, result } = validator(leaveId, leaveType, fromDate, toDate, reason);
    console.log({ success, result });
    if (success) {
      const res = await API.leave.update(result);
      if (res.success) {
        dispatchSnackbar("Leave updated Successfully", snackBarTypes.success);
        onUpdate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [leaveId, leaveType, fromDate, toDate, reason]);

  return { handleUpdateLeave, error, loading };
};

const validator = (leaveId, leaveType, fromDate, toDate, reason) => {
  const isInvalid = {};
  const body = {};

  if (validateObjectId(leaveId)) {
    body.leaveId = leaveId;
  } else {
    isInvalid.leaveId = "Invalid leave ID";
  }
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

export default useUpdateLeave;
