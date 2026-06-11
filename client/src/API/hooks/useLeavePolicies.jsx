import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";

const useLeavePolicies = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);
  const loading = useSelector((state) => state.apiStatus[endpoints.leave.policy.list]);

  const getLeavesPolicies = async () => {
    const res = await API.leave.policy.list({});
    if (res) {
      const {
        data: { leavePolicies },
      } = res;
      setLeavePolicies(leavePolicies);
    }
  };

  useEffect(() => {
    getLeavesPolicies();
  }, []);

  const refresh = () => setPage(1);

  return { getLeavesPolicies, leavePolicies, loading };
};

export default useLeavePolicies;
