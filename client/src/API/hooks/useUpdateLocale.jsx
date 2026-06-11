import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { storage } from "src/utils/storage";

const useUpdateLocale = () => {
  const dispatch = useDispatch();
  const getLocale = async () => {
    const response = await axios.get("https://ipapi.co/json/");
    const { data } = response;
    if (data && Object.keys(data).length) {
      storage.set(storage.keys.locale, data);
    }
  };

  useEffect(() => {
    getLocale();
  }, []);
};

export default useUpdateLocale;
