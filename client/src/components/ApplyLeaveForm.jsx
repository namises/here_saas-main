import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useState } from "react";
import SolidButton from "./SolidButton";
import NormalInput from "./NormalInput";
import DateInput from "./DateInput";
import useApplyLeave from "src/API/hooks/useApplyLeave";
import LeaveTypeDropdown from "./LeaveTypeDropdown";

export default function ApplyLeaveForm({ isOpen, setIsOpen, getLeaveAplications }) {
  const handleClose = () => {
    setIsOpen(false);
  };

  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const { handleApplyLeave, error, loading } = useApplyLeave(leaveType, fromDate, toDate, reason);

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
              <SolidButton title={"Apply"} onClick={handleApplyLeave} loading={loading} className="w-full" />
            </div>
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
}
