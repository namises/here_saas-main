import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateDomain, validateEmail, validatePhoneNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/utils/constants";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import { storage } from "src/utils/storage";
import { updateUser } from "src/redux/reducers/user";

const useLogin = (email, password) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.auth.login]);
  const [error, setError] = useState({});
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async () => {
    const { success, result } = validator(email, password);
    if (success) {
      const res = await API.auth.login(result);
      if (res.success) {
        const { token, user } = res.data;
        if (token) {
          storage.set(storage.keys.token, token);
          dispatch(updateUser({ ...user, token }));
        } else {
          dispatchSnackbar("Login successful, but no token received.", snackBarTypes.warning);
        }
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [email, password]);

  return { handleLogin, error, loading };
};

const validator = (email, password) => {
  const isInvalid = {};
  const body = {};
  if (validateEmail(email)) {
    body.email = email;
  } else {
    isInvalid.email = "Invalid email address";
  }
  if (validateStringLength(password, 6, 200)) {
    body.password = password;
  } else {
    isInvalid.password = "Password must be minimum 6 characters.";
  }

  return handleValidationError(isInvalid, body);
};

export default useLogin;
