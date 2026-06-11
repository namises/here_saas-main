import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { useNavigate } from "react-router-dom";

const useAttendanceRequestApproove = (attendanceRequestId, checkIn, checkOut, reason, status, comments) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.attendance.approve]);
  const [error, setError] = useState({});
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleApprove = async () => {
    const { success, result } = validator(attendanceRequestId, checkIn, checkOut, reason, status, comments);
    if (success) {
      const res = await API.attendance.approve(result);
      if (res.success) {
        //
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [attendanceRequestId, checkIn, checkOut, reason, status, comments]);

  return { handleApprove, error, loading };
};

const validator = (attendanceRequestId, checkIn, checkOut, reason, status, comments) => {
  const isInvalid = {};
  const body = {};
  if (validateObjectId(attendanceRequestId)) {
    body.attendanceRequestId = attendanceRequestId;
  } else {
    isInvalid.attendanceRequestId = "Invalid request Id";
  }
  if (validateTimestamp(checkIn)) {
    body.checkIn = checkIn;
  } else {
    isInvalid.checkIn = "Invalid checkIn time";
  }
  if (validateTimestamp(checkOut)) {
    body.checkOut = checkOut;
  } else {
    isInvalid.checkOut = "Invalid checkOut time";
  }
  if (validateStringLength(reason, 1, 100)) {
    body.reason = reason;
  } else {
    isInvalid.reason = "Reason is required";
  }
  if (validateStringLength(reason, 1, 100)) {
    body.reason = reason;
  } else {
    isInvalid.reason = "Reason is required";
  }
  if (status && ["present", "half-day", "absent", "leave", "holiday", "week_off"].includes(status)) {
    body.status = status;
  } else {
    isInvalid.status = `Status must be one of the following: "present", "half-day", "absent", "leave", "holiday", "week_off"`;
  }
  if (comments) {
    if (validateStringLength(1, 100)) {
      body.comments = comments;
    } else {
      isInvalid.comments = `Comment must be between 1 to 100 Characters`;
    }
  }

  return handleValidationError(isInvalid, body);
};

export default useAttendanceRequestApproove;
