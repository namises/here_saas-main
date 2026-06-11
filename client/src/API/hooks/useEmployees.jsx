import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateRangeNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useEmployees = (empCode, name, employeeId, email, mobile, department, designation, manager, status) => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.employee.list]);

  const getEmployees = async () => {
    const { success, result } = validator(page, limit, empCode, name, employeeId, email, mobile, department, designation, manager, status);
    if (success) {
      const res = await API.employee.list(result);
      if (res) {
        // eslint-disable-next-line no-unused-vars
        const {
          data: {
            employees: {
              items,
              pagination: { currentPage, lastPage, limit, nextPage, previousPage, totalResults },
            },
          },
        } = res;
        setEmployees(items);
        setTotalPages(lastPage);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    getEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, empCode, name, employeeId, email, mobile, department, designation, manager, status]);

  const refresh = () => setPage(1);

  return { employees, totalPages, page, setPage, limit, setLimit, loading, error, refresh };
};

const validator = (page, limit, empCode, name, employeeId, email, mobile, department, designation, manager, status) => {
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
  if (employeeId) {
    if (validateObjectId(employeeId)) {
      body.employeeId = employeeId;
    }
  }
  body.name = name;
  body.email = email;
  body.mobile = mobile;
  body.department = department;
  body.designation = designation;
  body.manager = manager;
  body.empCode = empCode;
  if (status) {
    if (["active", "inactive", "resigned", "terminated"].includes(status)) {
      body.status = status;
    } else {
      isInvalid.status = "Status must be one of the following: active, inactive, resigned, terminated.";
    }
  }
  return handleValidationError(isInvalid, body);
};

export default useEmployees;
