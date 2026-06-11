import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useHierarchy = (employeeId) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.hierarchy.view]);
  const [error, setError] = useState({});
  const [hierarchy, setHierarchy] = useState({});
  const handleGetHierarchy = async () => {
    const { success, result } = validator(employeeId);
    if (success) {
      const res = await API.hierarchy.view(result);
      if (res.success) {
        const { hierarchy } = res.data;
        setHierarchy(hierarchy);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    handleGetHierarchy();
  }, [employeeId]);

  useEffect(() => {
    setError({});
  }, [employeeId]);

  return { hierarchy, error, loading };
};

const validator = (employeeId) => {
  const isInvalid = {};
  const body = {};
  if (validateObjectId(employeeId)) {
    body.employeeId = employeeId;
  } else {
    isInvalid.employeeId = "Invalid employee Id";
  }

  return handleValidationError(isInvalid, body);
};

export default useHierarchy;
