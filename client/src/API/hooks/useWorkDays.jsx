import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { validateRangeNumber, validateStringLength } from "../validations/validators";
import { handleValidationError } from "../validations/handleValidation";

const useWorkDays = () => {
  const [workDays, setWorkdays] = useState([]);
  const loading = useSelector((state) => state.apiStatus[endpoints.workDays.get] || state.apiStatus[endpoints.workDays.update]);

  const setWorkDay = (working, index) => {
    let temp = [...workDays];
    temp[index] = working;
    setWorkdays([...temp]);
  };

  const getWorkDays = async () => {
    const res = await API.workDays.get();
    if (res) {
      // eslint-disable-next-line no-unused-vars
      const {
        data: { workDays },
      } = res;
      setWorkdays(workDays);
    }
  };

  const updateWorkDays = async () => {
    const res = await API.workDays.update({ workDays });
    if (res) {
      // eslint-disable-next-line no-unused-vars
      const {
        data: { workDays },
      } = res;
      setWorkdays(workDays);
    }
  };

  useEffect(() => {
    getWorkDays();
  }, []);

  return { workDays, getWorkDays, updateWorkDays, loading, setWorkDay };
};

export default useWorkDays;
