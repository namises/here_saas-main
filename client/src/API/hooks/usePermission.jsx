import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";

const usePermission = () => {
  const [permissions, setPermissions] = useState({});

  const loading = useSelector((state) => state.apiStatus[endpoints.permission.get]);

  const getPermissions = async () => {
    const res = await API.permission.get();
    if (res) {
      const {
        data: { permissions },
      } = res;
      setPermissions(permissions);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return { permissions, loading };
};

export default usePermission;
