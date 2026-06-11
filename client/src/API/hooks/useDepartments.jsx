import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateRangeNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useDepartments = (name, code, description) => {
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(null);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.department.list]);

  const getDepartments = async (page) => {
    const { success, result } = validator(page, limit, name, code, description);
    if (success) {
      const res = await API.department.list(result);
      if (res) {
        // eslint-disable-next-line no-unused-vars
        const {
          data: {
            departments: {
              items,
              pagination: { currentPage, lastPage, limit, nextPage, previousPage, totalResults },
            },
          },
        } = res;
        setDepartments(items);
        setTotalPages(lastPage);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    getDepartments(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, name, code, description]);

  return { departments, totalPages, page, setPage, limit, setLimit, loading, getDepartments, error };
};

const validator = (page, limit, name, code, description) => {
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
  if (validateStringLength(name, 3, 100)) {
    body.name = name;
  }
  if (validateStringLength(code, 3, 100)) {
    body.code = code;
  }
  if (validateStringLength(description, 3, 100)) {
    body.description = description;
  }
  return handleValidationError(isInvalid, body);
};

export default useDepartments;
