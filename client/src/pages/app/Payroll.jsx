import React, { useState } from "react";
import { Pagination } from "flowbite-react";
import { MdFilterAlt } from "react-icons/md";
import useDownloadPayslip from "src/API/hooks/useDownloadPayslip";
import usePayrollExport from "src/API/hooks/usePayrollExport";
import usePayrolls from "src/API/hooks/usePayrolls";
import PayrollCardView from "src/components/PayrollCardView";
import PayrollFilter from "src/components/PayrollFilter";
import PayrollTableView from "src/components/PayrollTableView";
import SolidButton from "src/components/SolidButton";
import useIsMobile from "src/hooks/useIsMobile";

const Attendance = () => {
  const isMobile = useIsMobile();
  const [showFilter, setShowFilter] = useState(isMobile ? false : true);
  const [employee, setEmployee] = useState(null);
  const [month, setMonth] = useState(null);
  const [status, setStatus] = useState("");
  const [financialYear, setFinancialYear] = useState(null);
  const { error: paySLipDownLoadError, loading: payslipDownloadLoading, downLoadPayslip } = useDownloadPayslip();
  const { payrolls, totalPages, page, setPage, limit, setLimit, loading, error, refresh } = usePayrolls(employee, month, status, financialYear);
  const { exportPayroll, loading: exportPayrollLoading, error: exportPayrollError } = usePayrollExport(employee, month, status, financialYear);

  const clearFilter = () => {
    setEmployee(null);
    setMonth(null);
    setStatus("");
    setFinancialYear(null);
  };
  return (
    <>
      {/* <pre>{JSON.stringify(payrolls, null, 2)}</pre> */}
      <div className="flex flex-row justify-end items-center gap-5 mb-5 text-2xl text-white">
        <SolidButton Icon={MdFilterAlt} title="Filter" onClick={() => setShowFilter(!showFilter)} />
      </div>
      {showFilter ? <PayrollFilter employee={employee} status={status} month={month} financialYear={financialYear} setEmployee={setEmployee} setStatus={setStatus} setMonth={setMonth} setFinancialYear={setFinancialYear} clearFilter={clearFilter} exportPayroll={exportPayroll} exportPayrollLoading={exportPayrollLoading} /> : null}
      {isMobile ? <PayrollCardView payrolls={payrolls} loading={loading} downLoadPayslip={downLoadPayslip} payslipDownloadLoading={payslipDownloadLoading} /> : <PayrollTableView payrolls={payrolls} loading={loading} downLoadPayslip={downLoadPayslip} payslipDownloadLoading={payslipDownloadLoading} />}
      {totalPages && totalPages > 1 ? (
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} showIcons />
        </div>
      ) : null}
    </>
  );
};

export default Attendance;
