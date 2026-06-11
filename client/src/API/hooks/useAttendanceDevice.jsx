import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";

const useAttendanceDevice = () => {
  const [url, setUrl] = useState(null);

  const loading = useSelector((state) => state.apiStatus[endpoints.attendance.listDevice]);

  const getDevices = async () => {
    const res = await API.attendance.listDevice();
    if (res?.data?.url) {
      setUrl(res.data.url);
    }
  };
  useEffect(() => {
    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { url, loading };
};

export default useAttendanceDevice;
