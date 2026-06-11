import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useEffect, useState } from "react";
import SolidButton from "./SolidButton";
import NormalInput from "./NormalInput";
import DateInput from "./DateInput";
import LeaveTypeDropdown from "./LeaveTypeDropdown";
import useUpdateLeave from "src/API/hooks/useUpdateLeave";

export default function UpdateLeaveForm({ isOpen, setIsOpen, onUpdate }) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const onSuccess = () => {
    setIsOpen(false);
    onUpdate();
  };

  const [leaveId, setLeaveId] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const { handleUpdateLeave, error, loading } = useUpdateLeave(leaveId, leaveType, fromDate, toDate, reason, onSuccess);

  useEffect(() => {
    if (isOpen && isOpen._id) {
      setLeaveId(isOpen._id);
      setLeaveType(isOpen.leaveType);
      setFromDate(isOpen.fromDate);
      setToDate(isOpen.toDate);
      setReason(isOpen.reason);
    }
  }, [isOpen]);

  return (
    <>
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={handleClose}>
        <DrawerHeader title="Add Leave" titleIcon={() => null} />
        <DrawerItems>
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row gap-4">
              <LeaveTypeDropdown value={leaveType} setter={setLeaveType} />
            </div>
            <div className="flex flex-row gap-4">
              <DateInput required={true} label={"From Date"} value={fromDate} setter={setFromDate} error={error.fromDate} />
              <DateInput required={true} label={"To Date"} value={toDate} setter={setToDate} error={error.toDate} />
            </div>
            <div className="flex flex-row gap-4">
              <NormalInput label={"Reason"} value={reason} setter={setReason} error={error.reason} required />
            </div>

            <div className="my-6 ">
              <SolidButton title={"Apply"} onClick={handleUpdateLeave} loading={loading} className="w-full" />
            </div>
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
}
