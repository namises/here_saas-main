import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useEffect, useState } from "react";

import SolidButton from "./SolidButton";
import useAddEmployee from "src/API/hooks/useAddEmployee";
import NormalInput from "./NormalInput";

import DepartmentSearchDropdown from "./DepartmentSearchDropdown";
import EmployeeSearchDropdown from "./EmployeeSearchDropdown";
import DateInput from "./DateInput";
import ShiftSearchDropdown from "./ShiftSearchDropdown";
import useAttendanceRequest from "src/API/hooks/useAttendanceRequest";
import DateTimePicker from "./DateTimePicker";

export default function AttendanceRequestForm({ isOpen, setIsOpen, onCreate }) {
  const handleClose = () => {
    setIsOpen(null);
  };
  const onSuccess = () => {
    setIsOpen(null);
    onCreate();
  };
  const [attendanceId, setAttendanceId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reason, setReason] = useState("");

  const { handleAttendanceRequest, error, loading } = useAttendanceRequest(attendanceId, checkIn, checkOut, reason, onSuccess);

  useEffect(() => {
    if (isOpen && isOpen._id) {
      setAttendanceId(isOpen._id);
      setCheckIn(isOpen.checkIn);
      setCheckOut(isOpen.checkOut);
    }
  }, [isOpen]);

  return isOpen ? (
    <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={(handleClose, handleClose)}>
      <DrawerHeader title="Attendance change Request" titleIcon={() => null} />
      <DrawerItems>
        <DateTimePicker value={checkIn} setter={setCheckIn} label={"Check In Time"} required={true} error={error?.checkIn} />
        <DateTimePicker value={checkOut} setter={setCheckOut} label={"Check Out Time"} required={true} error={error?.checkOut} />
        <NormalInput value={reason} setter={setReason} required={true} label={"Reason"} error={error.reason} />
        <div className="mb-6">
          <SolidButton title={"Add"} onClick={handleAttendanceRequest} loading={loading} className="w-full" />
        </div>
      </DrawerItems>
    </Drawer>
  ) : null;
}
