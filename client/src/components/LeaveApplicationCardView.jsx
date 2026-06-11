import React from "react";
import { Badge, Card } from "flowbite-react";
import { formatTimestampToHumandate, formatTimestampToHumandateTime } from "src/utils";
import { MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import SolidButton from "./SolidButton";

const LeaveApplicationCardView = ({ leaveApplications, loading, approve, reject, approvalLoading, rejectionLoading, setIsLeaveUpdateFormOpen }) => {
  const { employee } = useSelector((state) => state.user);

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      {loading
        ? [1, 2, 3, 4].map((v) => <Card className="animate-pulse w-sm"></Card>)
        : leaveApplications && leaveApplications.length
        ? leaveApplications.map((item) => (
            <Card className="w-full">
              <div className="flex justify-start items-center gap-4">
                <div className="w-full flex flex-col justify-start items-start gap-y-4">
                  <div className="flex w-full justify-between items-center mb-1">
                    <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">{item?.employee?.name}</h5>
                    <div className="flex gap-4 items-center justify-center">
                      <Badge color="success" className="capitalize flex justify-center items-center">
                        {item?.status}
                      </Badge>
                      {item?.employee?._id === employee && item?.status === "pending" ? <MdEdit className="cursor-pointer text-xl text-white" onClick={() => setIsLeaveUpdateFormOpen({ ...item })} /> : null}
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.fromDate ? `From : ${formatTimestampToHumandate(item?.fromDate)}` : "From : Not Available"}</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.toDate ? `To : ${formatTimestampToHumandate(item?.toDate)}` : "To : Not Available"}</p>
                  </div>
                  <div className="w-full grid grid-cols-2 mb-1">
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.leaveType ? `Type : ${item?.leaveType}` : "Type : Not Available"}</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.toDate ? `Days : ${item?.days}` : "Days : Not Available"}</p>
                  </div>
                  <p className="w-full font-normal text-sm text-gray-700 dark:text-gray-400">Reason - {item?.reason}</p>
                  {item?.status === "pending" ? (
                    <div className="w-full grid grid-cols-2 gap-x-4 mb-1">
                      {item?.owner === employee ? <SolidButton title={"Approve"} onClick={() => approve(item?._id)} loading={approvalLoading} /> : null}
                      {item?.owner === employee ? <SolidButton title={"Reject"} onClick={() => reject(item?._id)} loading={rejectionLoading} /> : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          ))
        : null}
    </div>
  );
};

export default LeaveApplicationCardView;
