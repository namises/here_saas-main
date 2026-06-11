import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import { validateObjectId, validateRangeNumber, validateStringLength, validateTimein24hrs } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useShift = () => {
  const [shiftInCreation, setShiftInCreation] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.shift.list] || state.apiStatus[endpoints.shift.create] || state.apiStatus[endpoints.shift.update] || state.apiStatus[endpoints.shift.delete]);

  const createShift = async () => {
    const { name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration } = shiftInCreation || {};
    const { success, result } = validator(name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration);
    if (success) {
      const res = await API.shift.create(result);
      if (res.success) {
        getShifts();
        setShiftInCreation(null);
      }
    } else {
      setError({ ...result });
    }
  };

  const getShifts = async () => {
    const res = await API.shift.list();
    if (res && res.success) {
      const {
        data: { shifts },
      } = res;
      setShifts([...shifts]);
    }
  };

  const updateShift = async ({ shiftId, name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration }, onComplete) => {
    const valid = validateObjectId(shiftId);
    if (!valid) return dispatchSnackbar("Not a valid shift Id", snackBarTypes.error);
    const { success, result } = validator(name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration);
    if (success) {
      const res = await API.shift.update({ ...result, shiftId });
      if (res.success) {
        getShifts();
        if (onComplete && typeof onComplete === "function") {
          onComplete();
        }
      }
    } else {
      setError({ ...result });
    }
  };

  const deleteShift = async (shiftId) => {
    const valid = validateObjectId(shiftId);
    if (!valid) return dispatchSnackbar("Not a valid shift Id", snackBarTypes.error);
    const res = await API.shift.delete({ shiftId });
    if (res?.success) {
      return await getShifts();
    }
  };

  const onClickAddShift = () =>
    setShiftInCreation({
      name: "New Shift",
      startTime: "10:00",
      endTime: "19:00",
      gracePeriodMins: 0,
    });
  const onClickDeleteShiftInCreation = () => setShiftInCreation(null);

  useEffect(() => {
    getShifts();
  }, []);

  useEffect(() => {
    setError({});
  }, [shiftInCreation]);

  return { shifts, getShifts, createShift, updateShift, deleteShift, onClickAddShift, onClickDeleteShiftInCreation, shiftInCreation, setShiftInCreation, loading, error };
};

export default useShift;

const validator = (name, startTime, endTime, gracePeriodMins, minHalfDayDuration, minFullDayDuration) => {
  const isInvalid = {};
  const body = {};
  if (validateStringLength(name, 3, 16)) {
    body.name = name;
  } else {
    isInvalid.name = "Shift Name must be minimum 3 and maximum 16 characters.";
  }
  if (validateTimein24hrs(startTime)) {
    body.startTime = startTime;
  } else {
    isInvalid.startTime = "Invalid Start time";
  }
  if (validateTimein24hrs(endTime)) {
    body.endTime = endTime;
  } else {
    isInvalid.endTime = "Invalid End time";
  }
  if (validateRangeNumber(gracePeriodMins, 0, 60)) {
    body.gracePeriodMins = gracePeriodMins;
  } else {
    isInvalid.gracePeriodMins = "Grace can be maximum 60 mins";
  }
  if (validateTimein24hrs(minHalfDayDuration)) {
    body.minHalfDayDuration = minHalfDayDuration;
  } else {
    isInvalid.minHalfDayDuration = "Invalid halfday duration";
  }
  if (validateTimein24hrs(minFullDayDuration)) {
    body.minFullDayDuration = minFullDayDuration;
  } else {
    isInvalid.minFullDayDuration = "Invalid Fullday duration";
  }
  return handleValidationError(isInvalid, body);
};
