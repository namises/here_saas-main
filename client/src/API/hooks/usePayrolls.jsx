import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateFinancialYear, validateObjectId, validateRangeNumber, validateStringLength, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const usePayrolls = (employee, month, status, financialYear) => {
  const [payrolls, setPayrolls] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.payroll.list]);

  const getPayrolls = async () => {
    const { success, result } = validator(page, limit, employee, month, status, financialYear);
    if (success) {
      const res = await API.payroll.list(result);
      if (res) {
        const {
          data: {
            payrolls: {
              items,
              pagination: { currentPage, lastPage, limit, nextPage, previousPage, totalResults },
            },
          },
        } = res;
        setPayrolls([...items]);
        setTotalPages(lastPage);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    getPayrolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, employee, month, status, financialYear]);

  const refresh = () => setPage(1);

  return { payrolls, totalPages, page, setPage, limit, setLimit, loading, error, refresh };
};

const validator = (page, limit, employee, month, status, financialYear) => {
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
    if (["pending", "processed"].includes(status)) {
      body.status = status;
    } else {
      isInvalid.status = `Status must be one of the following: "pending", "processed"`;
    }
  }
  if (month) {
    if (["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].includes(month)) {
      body.month = month;
    } else {
      isInvalid.month = `Invalid Month`;
    }
  }
  if (financialYear) {
    if (validateFinancialYear(financialYear)) {
      body.financialYear = financialYear;
    } else {
      isInvalid.financialYear = `Invalid Financial year`;
    }
  }

  return handleValidationError(isInvalid, body);
};

export default usePayrolls;
