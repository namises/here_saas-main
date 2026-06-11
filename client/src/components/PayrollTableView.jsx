import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { MdDownload, MdHourglassTop } from "react-icons/md";
import Amount from "./Amount";

const PayrollTableView = ({ payrolls, loading, downLoadPayslip, payslipDownloadLoading }) => {
  return (
    <div className="overflow-x-auto mt-5 rounded-md">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Code</TableHeadCell>
            <TableHeadCell>Net Amount</TableHeadCell>
            <TableHeadCell>Deductions</TableHeadCell>
            <TableHeadCell>Gross Amount</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Month</TableHeadCell>
            <TableHeadCell>Financial year</TableHeadCell>
            <TableHeadCell>Total Days</TableHeadCell>
            <TableHeadCell>Present days</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
            <TableHeadCell>PaySlip</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10].map((v) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((v) => (
                    <TableCell className="">
                      <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : payrolls && payrolls.length
            ? payrolls.map((item) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.employee?.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.employee?.empCode}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Amount amount={item?.netSalary} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Amount amount={item?.grossSalary - item?.netSalary} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Amount amount={item?.grossSalary} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Badge className="capitalize flex justify-center" color="success">
                      {item?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.month}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.financialYear}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.totalWorkingDays}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.presentDays}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {/* {item?.employee?._id === employee ? <MdEdit className="cursor-pointer text-xl text-white" onClick={() => setRequesting({ ...item })} /> : null} */}
                    <p>Edit</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{payslipDownloadLoading ? <MdHourglassTop className="cursor-pointer text-xl text-white" /> : <MdDownload className="cursor-pointer text-xl text-white" onClick={() => downLoadPayslip(item?._id)} />}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTableView;
