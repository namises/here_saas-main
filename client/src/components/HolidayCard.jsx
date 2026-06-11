import React, { useState } from "react";
import NormalInput from "./NormalInput";
import TimeInput from "./TimeInput";
import { MdCheck, MdClose, MdEdit, MdDeleteOutline } from "react-icons/md";
import DateInput from "./DateInput";

const HolidayCard = ({ _id: holidayId, date: _date, name: _name, remarks: _remarks, updateHoliday, deleteHoliday }) => {
  const [holiday, setHoliday] = useState({
    holidayId,
    name: _name,
    date: _date,
    remarks: _remarks,
  });
  const [disabled, setDisabled] = useState(true);
  return (
    <div key={holiday.holidayId} className="flex flex-col gap-2 border-2 mt-5 border-gray-500 rounded-md p-3 mb-4">
      <div className="flex justify-end items-center text-2xl gap-3">
        {disabled ? <MdEdit onClick={() => setDisabled(false)} className="text-gray-500 cursor-pointer" /> : <MdClose onClick={() => setDisabled(true)} className="text-gray-500 cursor-pointer" />}
        {!disabled ? <MdCheck onClick={() => updateHoliday(holiday, () => setDisabled(true))} className="text-green-600 cursor-pointer" /> : null}
        <MdDeleteOutline onClick={() => deleteHoliday(holiday.holidayId)} className="text-red-500 cursor-pointer" />
      </div>
      <NormalInput disabled={disabled} label={"Holiday Name"} value={holiday.name} setter={(name) => setHoliday({ ...holiday, name })} />
      <div className="flex mb-2 gap-2 items-center h-full ">
        <DateInput disabled={disabled} required={true} label={"Date"} value={holiday.date} setter={(date) => setHoliday({ ...holiday, date })} />
        <NormalInput disabled={disabled} label={"Remarks"} value={holiday?.remarks} setter={(remarks) => setHoliday({ ...holiday, remarks })} />
      </div>
    </div>
  );
};

export default HolidayCard;
