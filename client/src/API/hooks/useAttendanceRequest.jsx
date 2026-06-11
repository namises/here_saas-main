import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useAttendanceRequest = (attendanceId, checkIn, checkOut, reason, onCreate) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.attendance.request]);
  const [error, setError] = useState({});

  const handleAttendanceRequest = async () => {
    console.log("calling");
    const { success, result } = validator(attendanceId, checkIn, checkOut, reason);
    console.log({ success, result });
    if (success) {
      const res = await API.attendance.request(result);
      if (res.success) {
        dispatchSnackbar("Attendance Request Added Successfully", snackBarTypes.success);
        onCreate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [attendanceId, checkIn, checkOut, reason]);

  return { handleAttendanceRequest, error, loading };
};

const validator = (attendanceId, checkIn, checkOut, reason) => {
  const isInvalid = {};
  const body = {};

  if (validateObjectId(attendanceId)) {
    body.attendanceId = attendanceId;
  } else {
    isInvalid.attendanceId = "Invalid attedance id";
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

  return handleValidationError(isInvalid, body);
};

export default useAttendanceRequest;
