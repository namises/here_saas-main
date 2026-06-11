import { Card } from "flowbite-react";
import React from "react";
import EmployeeSearchDropdown from "./EmployeeSearchDropdown";
import SolidButton from "./SolidButton";
import FinancialYearDropdown from "./FinancialYearDropdown";
import MonthDropdown from "./MonthDropdown";
import PayrollStatusDropdown from "./PayrollStatusDropdown";

const PayrollFilter = ({ employee, status, month, financialYear, setEmployee, setStatus, setMonth, setFinancialYear, clearFilter, exportPayroll, exportPayrollLoading }) => {
  return (
    <Card>
      <div className="flex gap-x-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-4">
          {/* <DepartmentSearchDropdown value={department} setter={setDepartent} /> */}
          <EmployeeSearchDropdown label={"Employee"} value={employee} setter={setEmployee} />
          <FinancialYearDropdown value={financialYear} setter={setFinancialYear} required={false} />
          <MonthDropdown value={month} setter={setMonth} required={false} />
          <PayrollStatusDropdown value={status} setter={setStatus} required={false} />
          <div className="flex justify-start items-center gap-4">
            <SolidButton className="w-full" onClick={clearFilter} title={"Clear"} />
            <SolidButton className="w-full" loading={exportPayrollLoading} onClick={exportPayroll} title={"Export"} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PayrollFilter;
