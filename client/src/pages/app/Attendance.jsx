import { Pagination } from "flowbite-react";
import React, { useState } from "react";
import { MdFilterAlt } from "react-icons/md";
import useAttendance from "src/API/hooks/useAttendance";
import useAttendanceExport from "src/API/hooks/useAttendanceExport";
import AttendanceCardView from "src/components/AttendanceCardView";
import AttendanceFilter from "src/components/AttendanceFilter";
import AttendanceRequestForm from "src/components/AttendanceRequestForm";
import AttendanceRequests from "src/components/AttendanceRequests";
import AttendanceTableView from "src/components/AttendanceTableView";
import SolidButton from "src/components/SolidButton";
import useIsMobile from "src/hooks/useIsMobile";

const Attendance = () => {
  const isMobile = useIsMobile();
  const [showFilter, setShowFilter] = useState(isMobile ? false : true);
  const [employee, setEmployee] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("");
  const [requested, setRequested] = useState("");
  const [requesting, setRequesting] = useState(null);
  const { attendance, totalPages, page, setPage, limit, setLimit, loading, error, refresh } = useAttendance(employee, startDate, endDate, status, requested);
  const { exportAttendance, loading: exportAttendanceLoading, error: exportAttendanceError } = useAttendanceExport(employee, startDate, endDate, status, requested);
  const clearFilter = () => {
    setEmployee(null);
    setStartDate(null);
    setEndDate(null);
    setStatus("");
    setRequested("");
  };
  return (
    <>
      <div className="flex flex-row justify-end items-center gap-5 mb-5 text-2xl text-white">
        <SolidButton Icon={MdFilterAlt} title="Filter" onClick={() => setShowFilter(!showFilter)} />
        <AttendanceRequests />
      </div>
      <AttendanceRequestForm isOpen={requesting} setIsOpen={setRequesting} onCreate={refresh} />
      {showFilter ? <AttendanceFilter employee={employee} startDate={startDate} endDate={endDate} status={status} requested={requested} setEmployee={setEmployee} setStartDate={setStartDate} setEndDate={setEndDate} setStatus={setStatus} setRequested={setRequested} clearFilter={clearFilter} exportAttendance={exportAttendance} exportAttendanceLoading={exportAttendanceLoading} /> : null}
      {isMobile ? <AttendanceCardView attendance={attendance} loading={loading} setRequesting={setRequesting} /> : <AttendanceTableView attendance={attendance} loading={loading} setRequesting={setRequesting} />}
      {totalPages && totalPages > 1 ? (
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} showIcons />
        </div>
      ) : null}
    </>
  );
};

export default Attendance;
