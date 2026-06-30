import React, { useState } from "react";
import { Drawer, DrawerHeader, DrawerItems, Button } from "flowbite-react";
import EmployeeSearchDropdown from "./EmployeeSearchDropdown";
import MonthDropdown from "./MonthDropdown";
import FinancialYearDropdown from "./FinancialYearDropdown";
import { API } from "src/API/api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import { fmtMoney } from "src/utils/ui";

const Stat = ({ label, value, accent }) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-900/40">
    <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
  </div>
);

// Admin manually generates payroll for ONE employee for a month (no auto-run).
const GeneratePayrollForm = ({ isOpen, setIsOpen, onGenerated }) => {
  const [employee, setEmployee] = useState("");
  const [month, setMonth] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const close = () => {
    setIsOpen(false);
    setResult(null);
  };

  const generate = async () => {
    if (!employee || !month || !financialYear) {
      dispatchSnackbar("Select an employee, month and financial year", snackBarTypes.failure);
      return;
    }
    setGenerating(true);
    try {
      const res = await API.payroll.generate({ employee, month, financialYear });
      if (res?.success) {
        setResult(res.data.payroll);
        dispatchSnackbar(res.data.message || "Payroll generated", snackBarTypes.success);
        onGenerated?.();
      } else {
        dispatchSnackbar(res?.message || "Could not generate payroll", snackBarTypes.failure);
      }
    } catch (e) {
      dispatchSnackbar(e?.message || "Something went wrong", snackBarTypes.failure);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Drawer className="w-full max-w-[640px] z-100" open={isOpen} onClose={close} position="right">
      <DrawerHeader title="Generate Payroll" titleIcon={() => null} />
      <DrawerItems>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-400">Run payroll for one employee at a time. Present/absent/leave/holiday days are computed automatically from attendance.</p>
          <EmployeeSearchDropdown label="Employee" value={employee} setter={setEmployee} />
          <div className="grid grid-cols-2 gap-4">
            <FinancialYearDropdown value={financialYear} setter={setFinancialYear} required />
            <MonthDropdown value={month} setter={setMonth} required />
          </div>
          <Button color="blue" onClick={generate} isProcessing={generating} disabled={generating} className="w-full">
            Generate payroll
          </Button>

          {result ? (
            <div className="mt-2 rounded-2xl border border-gray-100 p-4 dark:border-gray-700">
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Result — {result.month} {result.financialYear}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                <Stat label="Present" value={result.presentDays} accent="text-emerald-600" />
                <Stat label="Absent" value={result.absentDays} accent="text-red-600" />
                <Stat label="Half days" value={result.halfDays} accent="text-amber-600" />
                <Stat label="Leave" value={result.leaveDays} accent="text-fuchsia-600" />
                <Stat label="Holidays" value={result.holidayDays} accent="text-sky-600" />
                <Stat label="Week-offs" value={result.weekOffDays} accent="text-gray-500" />
                <Stat label="Payable" value={result.payableDays} accent="text-blue-600" />
                <Stat label="Of days" value={result.totalDaysInMonth} accent="text-gray-500" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat label="Gross" value={fmtMoney(result.grossSalary)} accent="text-gray-800 dark:text-white" />
                <Stat label="Deductions" value={fmtMoney(result.totalDeductions)} accent="text-red-600" />
                <Stat label="Net pay" value={fmtMoney(result.netSalary)} accent="text-emerald-600" />
              </div>
            </div>
          ) : null}
        </div>
      </DrawerItems>
    </Drawer>
  );
};

export default GeneratePayrollForm;
