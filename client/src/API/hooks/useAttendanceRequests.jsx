import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";

const useAttendanceRequests = () => {
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(null);

  const loading = useSelector((state) => state.apiStatus[endpoints.attendance.listRequests]);

  const getAttendanceRequests = async () => {
    const res = await API.attendance.listRequests();
    if (res) {
      const {
        data: {
          attendanceRequests: {
            items,
            pagination: { currentPage, lastPage, limit, nextPage, previousPage, totalResults },
          },
        },
      } = res;
      setAttendanceRequests(items);
      setTotalPages(lastPage);
    }
  };

  const handlePorcessed = (id) => setAttendanceRequests([...attendanceRequests.filter((v) => v._id !== id)]);

  useEffect(() => {
    getAttendanceRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const refresh = () => setPage(1);

  return { attendanceRequests, totalPages, page, setPage, limit, setLimit, loading, refresh, handlePorcessed };
};

export default useAttendanceRequests;
