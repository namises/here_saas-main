import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateRangeNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useAttendanceExport = (employee, startDate, endDate, status, requested) => {
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.attendance.export]);

  const exportAttendance = async () => {
    const { success, result } = validator(employee, startDate, endDate, status, requested);
    if (success) {
      const res = await API.attendance.export(result);
      if (res) {
        const file = new Blob([res], { type: "text/csv" });
        const fileURL = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `attendance_report_${new Date()}.csv`;
        link.click();
        URL.revokeObjectURL(fileURL);
      }
    } else {
      setError({ ...result });
    }
  };

  return { exportAttendance, loading, error };
};

const validator = (employee, startDate, endDate, status, requested) => {
  const isInvalid = {};
  const body = {};

  if (employee) {
    if (validateObjectId(employee)) {
      body.employee = employee;
    } else {
      isInvalid.employee = "Invalid Value provided";
    }
  }
  if (startDate) {
    if (validateTimestamp(startDate)) {
      body.startDate = startDate;
    } else {
      isInvalid.startDate = "Invalid start time";
    }
  }
  if (endDate) {
    if (validateTimestamp(endDate)) {
      body.endDate = endDate;
    } else {
      isInvalid.endDate = "Invalid end time";
    }
  }
  if (status) {
    if (["present", "half-day", "absent", "leave", "holiday", "week_off"].includes(status)) {
      body.status = status;
    } else {
      isInvalid.status = `Status must be one of the following: "present", "half-day", "absent", "leave", "holiday", "week_off"`;
    }
  }
  if (requested) {
    body.requested = requested;
  }
  return handleValidationError(isInvalid, body);
};

export default useAttendanceExport;
