import React, { useState } from "react";
import NormalInput from "./NormalInput";
import TimeInput from "./TimeInput";
import { MdCheck, MdClose, MdEdit, MdDeleteOutline } from "react-icons/md";

const ShiftCard = ({ _id: shiftId, gracePeriodMins: _gracePeriodMins, name: _name, startTime: _startTime, endTime: _endTime, updateShift, deleteShift }) => {
  const [shift, setShift] = useState({
    shiftId,
    gracePeriodMins: _gracePeriodMins,
    name: _name,
    startTime: _startTime,
    endTime: _endTime,
  });
  const [disabled, setDisabled] = useState(true);
  return (
    <div key={shift.shiftId} className="flex flex-col gap-2 border-2 mt-5 border-gray-500 rounded-md p-3 mb-4">
      <div className="flex justify-end items-center text-2xl gap-3">
        {disabled ? <MdEdit onClick={() => setDisabled(false)} className="text-gray-500 cursor-pointer" /> : <MdClose onClick={() => setDisabled(true)} className="text-gray-500 cursor-pointer" />}
        {!disabled ? <MdCheck onClick={() => updateShift(shift, () => setDisabled(true))} className="text-green-600 cursor-pointer" /> : null}
        <MdDeleteOutline onClick={() => deleteShift(shift.shiftId)} className="text-red-500 cursor-pointer" />
      </div>
      <div className="flex mb-2 gap-2 items-center h-full ">
        <NormalInput disabled={disabled} label={"Shift Name"} value={shift.name} setter={(name) => setShift({ ...shift, name })} />
        <NormalInput disabled={disabled} value={shift.gracePeriodMins} setter={(gracePeriodMins) => setShift({ ...shift, gracePeriodMins })} label={"Grace in minutes"} />
      </div>
      <div className="flex mb-2 gap-2 items-center h-full ">
        <TimeInput disabled={disabled} value={shift.startTime} setter={(startTime) => setShift({ ...shift, startTime })} label={"Start Time"} required error={null} />
        <TimeInput disabled={disabled} value={shift.endTime} setter={(endTime) => setShift({ ...shift, endTime })} label={"End Time"} required error={null} />
      </div>
      <div className="flex mb-2 gap-2 items-center h-full ">
        <TimeInput disabled={disabled} value={shift.minHalfDayDuration} setter={(minHalfDayDuration) => setShift({ ...shift, minHalfDayDuration })} label={"Min Half Day Duration"} required error={null} />
        <TimeInput disabled={disabled} value={shift.minFullDayDuration} setter={(minFullDayDuration) => setShift({ ...shift, minFullDayDuration })} label={"Min Full day Duration"} required error={null} />
      </div>
    </div>
  );
};

export default ShiftCard;
