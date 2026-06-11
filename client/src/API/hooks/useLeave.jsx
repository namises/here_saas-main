import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateRangeNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useLeave = (employee, status, leaveType) => {
  const [leaves, setLeaves] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.leave.list]);

  const getLeaves = async () => {
    const { success, result } = validator(page, limit, employee, status, leaveType);
    if (success) {
      const res = await API.leave.list(result);
      if (res) {
        const {
          data: {
            leaves: {
              items,
              pagination: { currentPage, lastPage, limit, nextPage, previousPage, totalResults },
            },
          },
        } = res;
        setLeaves(items);
        setTotalPages(lastPage);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    getLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, employee, status, leaveType]);

  const refresh = () => setPage(1);

  return { leaves, totalPages, page, setPage, limit, setLimit, loading, error, refresh, getLeaves };
};

const validator = (page, limit, employee, status, leaveType) => {
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
  if (status) {
    if (["pending", "approved", "rejected"].includes(status)) {
      body.status = status;
    } else {
      isInvalid.status = `Status must be one of the following: "pending", "approved", "rejected"`;
    }
  }
  if (leaveType) {
    body.leaveType = leaveType;
  }
  return handleValidationError(isInvalid, body);
};

export default useLeave;
