import React from "react";
import { Badge, Card } from "flowbite-react";
import { MdCircle, MdDownload, MdHourglassTop } from "react-icons/md";
import Amount from "./Amount";

const PayrollCardView = ({ payrolls, loading, payslipDownloadLoading, downLoadPayslip }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      {loading
        ? [1, 2, 3, 4].map((v) => <Card className="animate-pulse w-sm"></Card>)
        : payrolls && payrolls.length
        ? payrolls.map((item) => (
            <Card className="w-full">
              <div className="flex justify-start items-center gap-4">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">{item?.employee?.name}</h5>
                    <div className="flex gap-4 items-center justify-center">
                      <Badge icon={MdCircle} color="success" className="capitalize flex justify-center items-center">
                        {item?.status}
                      </Badge>
                      <Badge icon={payslipDownloadLoading ? MdHourglassTop : MdDownload} color="success" className="capitalize flex justify-center items-center" onClick={() => downLoadPayslip(item?._id)}>
                        {"Payslip"}
                      </Badge>
                      {/* {item?.employee?._id === employee ? <MdEdit className="cursor-pointer text-xl text-white" onClick={() => setRequesting({ ...item })} /> : null} */}
                    </div>
                  </div>
                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mb-1">{item?.employee?.empCode}</p>
                  <div className="grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Gross Amount</p>
                    <Amount amount={item?.grossSalary} />
                  </div>
                  <div className="grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Deductions</p>
                    <Amount amount={item?.grossSalary - item?.netSalary} />
                  </div>
                  <div className="grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Net Amount</p>
                    <Amount amount={item?.netSalary} />
                  </div>
                  <div className="grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Month</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.month}</p>
                  </div>
                  <div className="grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Financial Year</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.financialYear}</p>
                  </div>
                  <div className="grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Total Days</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.totalWorkingDays}</p>
                  </div>
                  <div className="grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Work Days</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.presentDays}</p>
                  </div>

                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.attendanceRequest?.commnets}</p>
                </div>
              </div>
            </Card>
          ))
        : null}
    </div>
  );
};

export default PayrollCardView;
