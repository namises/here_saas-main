import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateDomain, validateEmail, validatePhoneNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useAddDepartment = (onCreate) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const loading = useSelector((s) => s.apiStatus[endpoints.department.create]);
  const [error, setError] = useState({});

  const handleAddDepartment = async () => {
    const { success, result } = validator(name, code, description);
    if (success) {
      const res = await API.department.create(result);
      if (res.success) {
        dispatchSnackbar("Department Created Successfully", snackBarTypes.success);
        onCreate();
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [name, code, description]);

  return { name, setName, code, setCode, description, setDescription, handleAddDepartment, error, loading };
};

const validator = (name, code, description) => {
  const isInvalid = {};
  const body = {};
  if (validateStringLength(name, 2, 64)) {
    body.name = name;
  } else {
    isInvalid.name = "Name must be minimum 2 and maximum 64 characters.";
  }
  if (validateStringLength(code, 2, 16)) {
    body.code = code;
  } else {
    isInvalid.code = "Code must be minimum 2 and maximum 16 characters.";
  }
  body.description = description;

  return handleValidationError(isInvalid, body);
};

export default useAddDepartment;
