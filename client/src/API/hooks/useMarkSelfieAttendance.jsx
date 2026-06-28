import { useDispatch, useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateLatitude, validateLongitude } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";
import { clearCheckInTime, updateCheckInTime } from "src/redux/reducers/checkInTime";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useMarkSelfieAttendance = (onSuccess) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.attendance.markSelfie]);
  const dispatch = useDispatch();

  const getPosition = (options) => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));

  const submitPunch = async (selfieDataUrl, lat, lng) => {
    const { success, result } = validator(selfieDataUrl, lat, lng);
    if (!success) return;
    const res = await API.attendance.markSelfie(result);
    if (res?.success) {
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
  };

  const handleMarkSelfieAttendance = async (selfieDataUrl) => {
    if (!("geolocation" in navigator)) {
      dispatchSnackbar("Geolocation is not supported on this device/browser.", snackBarTypes.failure);
      return;
    }
    // Geolocation only works in a secure context (https or localhost). A LAN IP over http silently fails.
    if (!window.isSecureContext) {
      dispatchSnackbar("Location needs a secure connection — open the app via localhost or HTTPS (not a LAN IP over http).", snackBarTypes.failure);
      return;
    }
    let position;
    try {
      position = await getPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
    } catch (error) {
      // kCLErrorLocationUnknown (code 2) is frequently transient — retry once with relaxed options.
      if (error?.code === 2) {
        try {
          await new Promise((r) => setTimeout(r, 1200));
          position = await getPosition({ enableHighAccuracy: false, timeout: 20000, maximumAge: 600000 });
        } catch (error2) {
          return reportGeoError(error2);
        }
      } else {
        return reportGeoError(error);
      }
    }
    await submitPunch(selfieDataUrl, position.coords.latitude, position.coords.longitude);
  };

  const reportGeoError = (error) => {
    // Surface the real reason instead of a generic message (code: 1=denied, 2=unavailable, 3=timeout).
    console.error("Geolocation error:", error?.code, error?.message);
    let msg = "Location access is required for selfie punch-in.";
    if (error?.code === 1) msg = "Location permission was denied. Allow location for this site in your browser, then try again.";
    else if (error?.code === 2) msg = "Couldn't get your location (macOS reported it as unavailable). Turn Wi-Fi ON and enable Location Services for your browser, then retry.";
    else if (error?.code === 3) msg = "Getting your location timed out. Please try again.";
    dispatchSnackbar(msg, snackBarTypes.failure);
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
