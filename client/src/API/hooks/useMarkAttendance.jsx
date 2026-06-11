import { useDispatch, useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateLatitude, validateLongitude, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { clearCheckInTime, updateCheckInTime } from "src/redux/reducers/checkInTime";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useMarkAttendance = (onSuccess) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.attendance.mark]);

  const dispatch = useDispatch();

  const handleMarkAttendance = async (code) => {
    navigator.geolocation.getCurrentPosition(async function (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const { success, result } = validator(code, lat, lng);
      if (success) {
        const res = await API.attendance.mark(result);
        if (res.success) {
          const { checkIn } = res.data;
          if (checkIn) {
            dispatch(updateCheckInTime(checkIn));
            dispatchSnackbar("Checked In Successfully", snackBarTypes.success);
          } else {
            dispatch(clearCheckInTime());
            dispatchSnackbar("Checked Out Successfully", snackBarTypes.success);
          }
          onSuccess();
        }
      }
    });
  };

  return { handleMarkAttendance, loading };
};

const validator = (code, lat, lng) => {
  const isInvalid = {};
  const body = {};
  if (validateStringLength(code, 6, 6)) {
    body.code = code;
  } else {
    isInvalid.code = "Invalid Code";
  }
  if (validateLatitude(lat)) {
    body.lat = lat;
  } else {
    isInvalid.lat = "Invalid latitude";
  }
  if (validateLongitude(lng)) {
    body.lng = lng;
  } else {
    isInvalid.lng = "Invalid longitude";
  }

  return handleValidationError(isInvalid, body);
};

export default useMarkAttendance;
