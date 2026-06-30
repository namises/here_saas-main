import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { Link } from "react-router-dom";
import { ROUTES } from "src/utils/constants";
import SolidButton from "./SolidButton";
import { useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import { formatTimestampToHumandate } from "src/utils";
import { isAdmin } from "src/utils/roles";

const LeaveApplicationTableView = ({ leaveApplications, loading, approve, reject, approvalLoading, rejectionLoading, setIsLeaveUpdateFormOpen }) => {
  const user = useSelector((state) => state.user);
  const employee = user?.employee;
  // Owner (assigned approver) OR any admin/super admin can act on a pending leave.
  const canAct = (item) => item?.status === "pending" && (item?.owner === employee || isAdmin(user));
  return (
    <div className="overflow-x-auto mt-5">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Designation</TableHeadCell>
            <TableHeadCell>From Date</TableHeadCell>
            <TableHeadCell>To Date</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Days</TableHeadCell>
            <TableHeadCell>Reason</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Approove</TableHeadCell>
            <TableHeadCell>Reject</TableHeadCell>
            <TableHeadCell>Edit</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((v) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1].map((_) => (
                    <TableCell className="">
                      <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : leaveApplications && leaveApplications.length
            ? leaveApplications.map((item) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.employee?.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.employee?.designation}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{formatTimestampToHumandate(item?.fromDate)}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{formatTimestampToHumandate(item?.toDate)}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.leaveType}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.days}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.reason}</TableCell>
                  <TableCell>
                    <Badge className="flex justify-center items-center capitalize" color="success">
                      {item?.status}
                    </Badge>
                  </TableCell>
                  <TableCell> {canAct(item) ? <SolidButton title={"Approve"} onClick={() => approve(item?._id)} loading={approvalLoading} /> : null}</TableCell>
                  <TableCell> {canAct(item) ? <SolidButton title={"Reject"} onClick={() => reject(item?._id)} loading={rejectionLoading} /> : null}</TableCell>
                  <TableCell>{item?.employee?._id === employee && item?.status === "pending" ? <MdEdit className="text-xl cursor-pointer" title={"Edit"} onClick={() => setIsLeaveUpdateFormOpen({ ...item })} /> : null}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveApplicationTableView;
