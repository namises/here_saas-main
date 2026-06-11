import { Drawer, DrawerHeader, DrawerItems, Badge, Button } from "flowbite-react";
import { useState } from "react";
import SolidButton from "./SolidButton";
import NormalInput from "./NormalInput";
import useAttendanceRequests from "src/API/hooks/useAttendanceRequests";
import AttendanceRequestsCard from "./AttendanceRequestsCard";

export default function AttendanceRequests() {
  const [isOpen, setIsOpen] = useState(false);
  const { attendanceRequests, totalPages, page, setPage, limit, setLimit, loading, refresh, handlePorcessed } = useAttendanceRequests();

  return (
    <>
      {attendanceRequests && attendanceRequests.length ? (
        <Button className={`bg-blue-400 cursor-pointer`} onClick={() => setIsOpen(true)}>
          Requests
          <Badge className="ms-2 rounded-full border-2 px-3 text-xs">{attendanceRequests.length}</Badge>
        </Button>
      ) : null}
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerHeader title="Pending Attendance Requests" titleIcon={() => null} />
        <DrawerItems>
          {attendanceRequests && attendanceRequests.length ? (
            attendanceRequests.map((request) => <AttendanceRequestsCard request={request} handlePorcessed={handlePorcessed} />)
          ) : (
            <div className="flex text-sm justify-center items-center mt-10">
              <p>No pending requests</p>
            </div>
          )}
        </DrawerItems>
      </Drawer>
    </>
  );
}
