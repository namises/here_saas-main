import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import { validateObjectId, validateRangeNumber, validateStringLength, validateTimein24hrs, validateTimestamp } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useHoliday = (financialYear) => {
  const [holidayInCreation, setHolidayInCreation] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [error, setError] = useState({});
  const loading = useSelector((state) => state.apiStatus[endpoints.holiday.list] || state.apiStatus[endpoints.holiday.create] || state.apiStatus[endpoints.holiday.update] || state.apiStatus[endpoints.holiday.delete]);

  const createHoliday = async () => {
    const { name, date, remarks } = holidayInCreation || {};
    const { success, result } = validator(name, date, remarks);
    if (success) {
      const res = await API.holiday.create(result);
      if (res.success) {
        getHolidays();
        setHolidayInCreation(null);
      }
    } else {
      setError({ ...result });
    }
  };

  const getHolidays = async () => {
    const res = await API.holiday.list({ financialYear });
    if (res && res.success) {
      const {
        data: { holidays },
      } = res;
      setHolidays([...holidays]);
    }
  };

  const updateHoliday = async ({ holidayId, name, date, remarks }, onComplete) => {
    const valid = validateObjectId(holidayId);
    if (!valid) return dispatchSnackbar("Not a valid holiday Id", snackBarTypes.error);
    const { success, result } = validator(name, date, remarks);
    if (success) {
      const res = await API.holiday.update({ ...result, holidayId });
      if (res.success) {
        getHolidays();
        if (onComplete && typeof onComplete === "function") {
          onComplete();
        }
      }
    } else {
      setError({ ...result });
    }
  };

  const deleteHoliday = async (holidayId) => {
    const valid = validateObjectId(holidayId);
    if (!valid) return dispatchSnackbar("Not a valid holiday Id", snackBarTypes.error);
    const res = await API.holiday.delete({ holidayId });
    if (res?.success) {
      return await getHolidays();
    }
  };

  const onClickAddHoliday = () =>
    setHolidayInCreation({
      name: "New Holiday",
      date: Math.floor(Date.now() / 1000),
      remark: "",
    });

  const onClickDeleteholidayInCreation = () => setHolidayInCreation(null);

  useEffect(() => {
    getHolidays();
  }, []);

  useEffect(() => {
    setError({});
  }, [holidayInCreation]);

  return { holidays, getHolidays, createHoliday, updateHoliday, deleteHoliday, onClickAddHoliday, onClickDeleteholidayInCreation, holidayInCreation, setHolidayInCreation, loading, error };
};

export default useHoliday;

const validator = (name, date, remarks) => {
  const isInvalid = {};
  const body = {};
  if (validateStringLength(name, 3, 16)) {
    body.name = name;
  } else {
    isInvalid.name = "Holiday Name must be minimum 3 and maximum 16 characters.";
  }
  if (validateTimestamp(date)) {
    body.date = date;
  } else {
    isInvalid.date = "Date is required";
  }
  if (validateStringLength(remarks, 3, 16)) {
    body.remarks = remarks;
  }

  return handleValidationError(isInvalid, body);
};
