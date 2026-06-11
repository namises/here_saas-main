import { useDispatch, useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateLatitude, validateLongitude } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { clearCheckInTime, updateCheckInTime } from "src/redux/reducers/checkInTime";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useMarkSelfieAttendance = (onSuccess) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.attendance.markSelfie]);
  const dispatch = useDispatch();

  const handleMarkSelfieAttendance = async (selfieDataUrl) => {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const { success, result } = validator(selfieDataUrl, lat, lng);
        if (success) {
          const res = await API.attendance.markSelfie(result);
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
      },
      function () {
        dispatchSnackbar("Location access is required for selfie punch-in", snackBarTypes.failure);
      }
    );
  };

  return { handleMarkSelfieAttendance, loading };
};

const validator = (selfie, lat, lng) => {
  const isInvalid = {};
  const body = {};
  if (selfie && selfie.startsWith("data:image")) {
    body.selfie = selfie;
  } else {
    isInvalid.selfie = "Invalid selfie image";
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

export default useMarkSelfieAttendance;
