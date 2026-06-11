import { useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useLeaveApprove = (onFinish = () => null) => {
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.leave.approve]);

  const approve = async (leaveId) => {
    const { success, result } = validator(leaveId);
    if (success) {
      await API.leave.approve(result);
      onFinish();
    } else {
      setError({ ...result });
    }
  };

  return { approve, loading, error };
};

const validator = (leaveId) => {
  const isInvalid = {};
  const body = {};

  if (validateObjectId(leaveId)) {
    body.leaveId = leaveId;
  } else {
    isInvalid.leaveId = "Invalid Leave Id";
  }

  return handleValidationError(isInvalid, body);
};

export default useLeaveApprove;
