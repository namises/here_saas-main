import { Datepicker } from "flowbite-react";
import React from "react";
import { dateStringToUnix, startOfUtcDayInSeconds, unixToDateString } from "src/utils";
import { dateTypes } from "src/utils/constants";

const DateInput = ({ value, setter, required, label, error, disabled, type = dateTypes.EXACT }) => {
  const formattedValue = new Date(unixToDateString(value ? value : startOfUtcDayInSeconds()));
  return (
    <div className="mb-2 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm m-0 text-gray-400">{required ? `${label}*` : label}</span>
        <span className="ml-1 text-xs mb-0 text-red-400">{error}&nbsp;</span>
      </div>
      <Datepicker icon={false} disabled={disabled} value={formattedValue} onChange={(e) => setter(dateStringToUnix(e, type))} />
    </div>
  );
};

export default DateInput;
