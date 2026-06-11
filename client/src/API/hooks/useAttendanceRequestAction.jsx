import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useAttendanceRequestAction = (attendanceRequestId, checkIn, checkOut, reason, status, comments, onCreate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.attendance.request]);
  const [error, setError] = useState({});

  const handleApproove = async () => {
    const { success, result } = approveValidator(attendanceRequestId, checkIn, checkOut, reason, status, comments);
    if (success) {
      const res = await API.attendance.approve(result);
      if (res.success) {
        dispatchSnackbar("Attendance Request Added Successfully", snackBarTypes.success);
        onCreate(attendanceRequestId);
      }
    } else {
      setError({ ...result });
    }
  };

  const handleReject = async () => {
    const { success, result } = rejectValidator(attendanceRequestId, comments);
    if (success) {
      const res = await API.attendance.request(result);
      if (res.success) {
        dispatchSnackbar("Attendance Request Added Successfully", snackBarTypes.success);
        onCreate(attendanceRequestId);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [attendanceRequestId, checkIn, checkOut, reason, status, comments]);

  return { handleReject, handleApproove, loading, error };
};

const approveValidator = (attendanceRequestId, checkIn, checkOut, reason, status, comments) => {
  const isInvalid = {};
  const body = {};

  if (validateObjectId(attendanceRequestId)) {
    body.attendanceRequestId = attendanceRequestId;
  } else {
    isInvalid.attendanceRequestId = "Invalid attedance request id";
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
  if (status && ["present", "half-day", "absent", "leave", "holiday", "week_off"].includes(status)) {
    body.status = status;
  } else {
    isInvalid.status = `Status must be one of the following: "present", "half-day", "absent", "leave", "holiday", "week_off"`;
  }
  if (comments) {
    if (validateStringLength(comments, 8, 100)) {
      body.comments = comments;
    } else {
      isInvalid.comments = `Comment must be 8 - 100 characters long`;
    }
  }

  return handleValidationError(isInvalid, body);
};

const rejectValidator = (attendanceRequestId, comments) => {
  const isInvalid = {};
  const body = {};

  if (validateObjectId(attendanceRequestId)) {
    body.attendanceRequestId = attendanceRequestId;
  } else {
    isInvalid.attendanceRequestId = "Invalid attedance request id";
  }

  if (validateStringLength(comments, 8, 100)) {
    body.comments = comments;
  } else {
    isInvalid.comments = `Comment must be 8 - 100 characters long`;
  }
  return handleValidationError(isInvalid, body);
};

export default useAttendanceRequestAction;
