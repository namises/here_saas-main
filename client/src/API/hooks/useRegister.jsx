import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateDomain, validateEmail, validatePan, validatePhoneNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/utils/constants";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useRegister = (orgName, address, pan, domain, name, email, mobile, password, confirmPassword, agreeToTerms) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.auth.register]);
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const handleRegister = async () => {
    const { success, result } = validator(orgName, address, pan, domain, name, email, mobile, password, confirmPassword, agreeToTerms);
    if (success) {
      const res = await API.auth.register(result);

      if (res.success) {
        navigate(ROUTES.AUTH.LOGIN);
        dispatchSnackbar("Registration successful! Please login to continue.", snackBarTypes.success);
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [orgName, address, pan, domain, name, email, mobile, password, confirmPassword, agreeToTerms]);

  return { handleRegister, error, loading };
};

const validator = (orgName, address, pan, domain, name, email, mobile, password, confirmPassword, agreeToTerms) => {
  const isInvalid = {};
  const body = {};
  if (validateStringLength(orgName, 3, 100)) {
    body.orgName = orgName;
  } else {
    isInvalid.orgName = "Organization Name must be minimum 3 and maximum 100 characters.";
  }
  if (validateStringLength(address, 1, 100)) {
    body.address = address;
  } else {
    isInvalid.address = "Address can be max 100 characters";
  }
  if (validatePan(pan)) {
    body.pan = pan;
  } else {
    isInvalid.pan = "Valid Organization PAN is required";
  }
  if (validateStringLength(orgName, 3, 100)) {
    body.orgName = orgName;
  } else {
    isInvalid.orgName = "Organization Name must be minimum 3 and maximum 100 characters.";
  }
  if (validateDomain(domain)) {
    body.domain = domain;
  } else {
    isInvalid.domain = "Valid Domain is required.";
  }
  if (validateStringLength(name, 3, 100)) {
    body.name = name;
  } else {
    isInvalid.name = "Name must be minimum 3 and maximum 100 characters.";
  }
  if (validateEmail(email)) {
    body.email = email;
  } else {
    isInvalid.email = "Invalid email address";
  }
  if (validatePhoneNumber(mobile)) {
    body.mobile = mobile;
  } else {
    isInvalid.mobile = "Invalid mobile number";
  }
  if (validateStringLength(password, 6, 200)) {
    body.password = password;
  } else {
    isInvalid.password = "Password must be minimum 6 characters.";
  }
  if (confirmPassword && password === confirmPassword) {
  } else {
    isInvalid.confirmPassword = "Passwords do not match";
  }
  if (agreeToTerms) {
  } else {
    isInvalid.agreeToTerms = "Read and agree to Terms and Conditions";
  }
  return handleValidationError(isInvalid, body);
};

export default useRegister;
