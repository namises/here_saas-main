import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateRangeNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useAttendance = (employee, startDate, endDate, status, requested) => {
  const [attendance, setAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.attendance.list]);

  const getAttendance = async () => {
    const { success, result } = validator(page, limit, employee, startDate, endDate, status, requested);
    if (success) {
      const res = await API.attendance.list(result);
      if (res) {
        const {
          data: {
            attendance: {
              items,
              pagination: { currentPage, lastPage, limit, nextPage, previousPage, totalResults },
            },
          },
        } = res;
        setAttendance(items);
        setTotalPages(lastPage);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    getAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, employee, startDate, endDate, status, requested]);

  const refresh = () => setPage(1);

  return { attendance, totalPages, page, setPage, limit, setLimit, loading, error, refresh };
};

const validator = (page, limit, employee, startDate, endDate, status, requested) => {
  const isInvalid = {};
  const body = {};
  if (validateRangeNumber(page, 1, 1000000000)) {
    body.page = page;
  } else {
    isInvalid.page = "Page must be a number between 1 and 1000000000.";
  }
  if (validateRangeNumber(limit, 1, 100)) {
    body.limit = limit;
  } else {
    isInvalid.limit = "Valid limit is required.";
  }
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

export default useAttendance;
