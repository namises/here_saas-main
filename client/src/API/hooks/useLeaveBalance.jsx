import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useLeaveBalance = (employee) => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.leave.balance]);

  const getLeaveBalances = async () => {
    const { success, result } = validator(employee);
    if (success) {
      const res = await API.leave.balance(result);
      if (res) {
        const {
          data: { leaves },
        } = res;
        setLeaveBalances(leaves);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    getLeaveBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);

  return { leaveBalances, loading, error };
};

const validator = (employee) => {
  const isInvalid = {};
  const body = {};
  if (employee) {
    if (validateObjectId(employee)) {
      body.employee = employee;
    } else {
      isInvalid.employee = "Invalid Value provided";
    }
  }
  return handleValidationError(isInvalid, body);
};

export default useLeaveBalance;
