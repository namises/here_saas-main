import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateRangeNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useEmployee = (employeeId) => {
  const [employee, setEmployee] = useState({});
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.employee.get]);

  const getEmployee = async () => {
    const { success, result } = validator(employeeId);
    if (success) {
      const res = await API.employee.get(result);
      if (res) {
        // eslint-disable-next-line no-unused-vars
        const {
          data: { employee },
        } = res;
        setEmployee({ ...employee });
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    getEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  return { employee, loading, error, getEmployee };
};

const validator = (employee) => {
  const isInvalid = {};
  const body = {};
  if (employee) {
    if (validateObjectId(employee)) {
      body.employee = employee;
    } else {
      isInvalid.employee = "Employee must be an Object Id";
    }
  }

  return handleValidationError(isInvalid, body);
};

export default useEmployee;
