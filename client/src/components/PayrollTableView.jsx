import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { MdDownload, MdHourglassTop } from "react-icons/md";
import Amount from "./Amount";

const Num = ({ value, className }) => <span className={`font-semibold ${className}`}>{value ?? 0}</span>;

const PayrollTableView = ({ payrolls, loading, downLoadPayslip, payslipDownloadLoading }) => {
  return (
    <div className="overflow-x-auto mt-5 rounded-md">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Code</TableHeadCell>
            <TableHeadCell>Month</TableHeadCell>
            <TableHeadCell>FY</TableHeadCell>
            <TableHeadCell>Present</TableHeadCell>
            <TableHeadCell>Absent</TableHeadCell>
            <TableHeadCell>Half</TableHeadCell>
            <TableHeadCell>Leave</TableHeadCell>
            <TableHeadCell>Holiday</TableHeadCell>
            <TableHeadCell>Week-off</TableHeadCell>
            <TableHeadCell>Payable / Total</TableHeadCell>
            <TableHeadCell>Gross</TableHeadCell>
            <TableHeadCell>Deductions</TableHeadCell>
            <TableHeadCell>Net</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>PaySlip</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                <TableRow key={v} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <TableCell key={i}>
                      <div className="w-[90%] animate-pulse bg-gray-100 dark:bg-gray-700 rounded-full p-2"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : payrolls && payrolls.length
            ? payrolls.map((item) => (
                <TableRow key={item?._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.employee?.name}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-500">{item?.employee?.empCode}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-900 dark:text-white">{item?.month}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-500">{item?.financialYear}</TableCell>
                  <TableCell><Num value={item?.presentDays} className="text-emerald-600" /></TableCell>
                  <TableCell><Num value={item?.absentDays} className="text-red-600" /></TableCell>
                  <TableCell><Num value={item?.halfDays} className="text-amber-600" /></TableCell>
                  <TableCell><Num value={item?.leaveDays} className="text-fuchsia-600" /></TableCell>
                  <TableCell><Num value={item?.holidayDays} className="text-sky-600" /></TableCell>
                  <TableCell><Num value={item?.weekOffDays} className="text-gray-500" /></TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="font-semibold text-blue-600">{item?.payableDays ?? "—"}</span>
                    <span className="text-gray-400"> / {item?.totalDaysInMonth || item?.totalWorkingDays}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-gray-900 dark:text-white"><Amount amount={item?.grossSalary} /></TableCell>
                  <TableCell className="whitespace-nowrap text-red-600"><Amount amount={(item?.grossSalary || 0) - (item?.netSalary || 0)} /></TableCell>
                  <TableCell className="whitespace-nowrap font-semibold text-emerald-600"><Amount amount={item?.netSalary} /></TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge className="capitalize flex justify-center" color={item?.status === "processed" ? "success" : "warning"}>
                      {item?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{payslipDownloadLoading ? <MdHourglassTop className="cursor-pointer text-xl" /> : <MdDownload className="cursor-pointer text-xl text-blue-500" onClick={() => downLoadPayslip(item?._id)} />}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTableView;
