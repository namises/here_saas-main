import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateObjectId, validateUUIDv4 } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { useNavigate } from "react-router-dom";
import { clearReducer } from "src/redux";
import { storage } from "src/utils/storage";
import { ROUTES } from "src/utils/constants";

const useLoginDevice = (login, pass, org, id) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.auth.loginDevice]);
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginDevice = async () => {
    const { success, result } = validator(login, pass, org, id);
    if (success) {
      const res = await API.auth.loginDevice(result);
      if (res.success) {
        const { secret, logo, name } = res.data;
        if (secret) {
          //clear redux
          dispatch(clearReducer());
          //clear localstore storage
          localStorage.clear();
          //setsecret to localstorage
          storage.set(storage.keys.here_id_key, { secret, logo, name });
          //navigate to TOTP page
          navigate(ROUTES.APP.ATTENDANCE_DEVICE_QR);
        }
      }
    } else {
      setError({ ...result });
    }
  };

  useEffect(() => {
    setError({});
  }, [login, pass, org, id]);

  return { handleLoginDevice, error, loading };
};

const validator = (login, pass, org, id) => {
  const isInvalid = {};
  const body = {};
  if (validateUUIDv4(login)) {
    body.login = login;
  } else {
    isInvalid.login = "Invalid login details";
  }
  if (validateUUIDv4(pass)) {
    body.pass = pass;
  } else {
    isInvalid.pass = "Invalid login details";
  }
  if (validateObjectId(org)) {
    body.org = org;
  } else {
    isInvalid.org = "Invalid login details";
  }
  if (validateObjectId(id)) {
    body.id = id;
  } else {
    isInvalid.id = "Invalid login details";
  }
  return handleValidationError(isInvalid, body);
};

export default useLoginDevice;
