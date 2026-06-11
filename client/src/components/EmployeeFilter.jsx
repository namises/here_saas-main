import { Card } from "flowbite-react";
import React from "react";
import NormalInput from "./NormalInput";
import DepartmentSearchDropdown from "./DepartmentSearchDropdown";
import EmployeeSearchDropdown from "./EmployeeSearchDropdown";
import EmployeeStatusDropdown from "./EmployeeStatusDropdown";
import SolidButton from "./SolidButton";

const EmployeeFilter = ({ department, setDepartent, manager, setManager, search, setSearch, status, setStatus, clearFilter }) => {
  return (
    <Card>
      <div className="flex">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <NormalInput label={"Search"} placeholder={"Search with Name, Email, Mobile, Employee Code, Designation..."} setter={setSearch} />
          <DepartmentSearchDropdown value={department} setter={setDepartent} />
          <EmployeeSearchDropdown label={"Manager"} value={manager} setter={setManager} />
          <div className="flex justify-center items-center gap-4">
            <EmployeeStatusDropdown value={status} setter={setStatus} />
            <SolidButton onClick={clearFilter} title={"Clear"} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeFilter;
