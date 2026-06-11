import { Button, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { formatTimestampToHumandateTime } from "src/utils";
import DateTimePicker from "./DateTimePicker";
import NormalInput from "./NormalInput";
import { MdClose, MdEdit } from "react-icons/md";
import AttendanceStatusDropdown from "./AttendanceStatusDropdown";
import useAttendanceRequestAction from "src/API/hooks/useAttendanceRequestAction";
import SolidButton from "./SolidButton";

export default function AttendanceRequestsCard({ request, handlePorcessed }) {
  const [disabled, setDisabled] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [comments, setComments] = useState("");
  const [status, setStatus] = useState();

  const { handleApproove, handleReject, loading, error } = useAttendanceRequestAction(request._id, checkIn, checkOut, request?.reason, status, comments, handlePorcessed);

  useEffect(() => {
    if (request?.checkIn) {
      setCheckIn(request?.checkIn);
    }
    if (request?.checkOut) {
      setCheckOut(request?.checkOut);
    }
    if (request?.attendance?.status) {
      setStatus(request?.attendance?.status);
    }
  }, [request]);

  return (
    <Card className="w-full">
      <div className="flex justify-start items-center gap-4">
        <div className="w-full">
          <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white mb-1">{request?.attendance?.employee?.name}</h5>
          <div className="flex gap-4">
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mb-1">{request?.attendance?.employee?.empCode}</p>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mb-1">{" - "}</p>

            <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mb-1">{request?.attendance?.employee?.email}</p>
          </div>

          <p className="font-normal mb-1 text-sm text-gray-700 dark:text-gray-400 w-full">
            Shift Details :{" "}
            {request?.attendance?.employee?.shift ? (
              <>
                <span>{request?.attendance?.employee?.shift?.name ? `${request?.attendance?.employee?.shift?.name} ${request?.attendance?.employee?.shift?.startTime} - ${request?.attendance?.employee?.shift?.endTime}` : ""}</span>
                <span>{request?.attendance?.employee?.shift?.isOvernight ? ` | (Overnight)` : ""}</span>
                <span>{request?.attendance?.employee?.shift?.gracePeriodMins ? ` | Grace Period - ${request?.attendance?.employee?.shift?.gracePeriodMins} Mins` : ""}</span>
              </>
            ) : (
              "Not Available"
            )}
          </p>
          <div className="flex gap-4 mb-1">
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">In : {request?.attendance?.checkIn ? `${formatTimestampToHumandateTime(request?.attendance?.checkIn)}` : "Not Available"}</p>
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Out : {request?.attendance?.checkOut ? `${formatTimestampToHumandateTime(request?.attendance?.checkOut)}` : "Not Available"}</p>
          </div>
          <div className="border py-3 px-4 rounded-md my-4">
            <div className="flex justify-end">{disabled ? <MdEdit className="text-xl cursor-pointer text-gray-100" onClick={() => setDisabled(false)} /> : <MdClose className="text-xl cursor-pointer text-gray-100" onClick={() => setDisabled(true)} />}</div>
            <DateTimePicker error={error.checkIn} label={"Requested Check In"} value={checkIn} setter={setCheckIn} required={true} disabled={disabled} />
            <DateTimePicker error={error.checkOut} label={"Requested Check Out"} value={checkOut} setter={setCheckOut} required={true} disabled={disabled} />
            <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mb-1">Reason : {request?.reason}</p>
          </div>
          <AttendanceStatusDropdown error={error.status} value={status} setter={setStatus} />
          <NormalInput error={error.comments} value={comments} setter={setComments} required={true} label={"Comments (Required in case of Rejection)"} />
          <div className="flex gap-4 mt-4">
            <SolidButton title={"Reject"} className="w-full" loading={loading} onClick={handleReject} />
            <SolidButton title={"Approve"} className="w-full" loading={loading} onClick={handleApproove} />
          </div>
        </div>
      </div>

      {/* requested attendance time  and reason option to edit request*/}
      {/* comments required if rejecting */}
      {/* approve and reject Buttons */}
    </Card>
  );
}
