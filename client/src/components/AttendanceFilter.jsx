import { Card } from "flowbite-react";
import React from "react";
import EmployeeSearchDropdown from "./EmployeeSearchDropdown";
import SolidButton from "./SolidButton";
import AttendanceStatusDropdown from "./AttendanceStatusDropdown";
import DateInput from "./DateInput";
import { dateTypes } from "src/utils/constants";
import CheckBox from "./CheckBox";
const AttendanceFilter = ({ employee, setEmployee, startDate, setStartDate, endDate, setEndDate, status, setStatus, requested, setRequested, clearFilter, exportAttendance, exportAttendanceLoading }) => {
  return (
    <Card>
      <div className="flex">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* <DepartmentSearchDropdown value={department} setter={setDepartent} /> */}
          <EmployeeSearchDropdown label={"Employee"} value={employee} setter={setEmployee} />
          <DateInput value={startDate} setter={setStartDate} label={"Start Date"} type={dateTypes.START} />
          <DateInput value={endDate} setter={setEndDate} label={"End Date"} type={dateTypes.END} />
          <AttendanceStatusDropdown value={status} setter={setStatus} />
          <div className="flex justify-start items-center gap-4">
            <CheckBox className="w-full" label={"Requested"} value={requested} setter={setRequested} hideError={true} />
            <SolidButton className="w-full" onClick={clearFilter} title={"Clear"} />
            <SolidButton className="w-full" loading={exportAttendanceLoading} onClick={exportAttendance} title={"Export"} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceFilter;
