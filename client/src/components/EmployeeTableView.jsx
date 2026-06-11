import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { Link } from "react-router-dom";
import { ROUTES } from "src/utils/constants";

const EmployeeTableView = ({ employees, loading }) => {
  return (
    <div className="overflow-x-auto mt-5">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>
              <span className="sr-only">Image</span>
            </TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Designation</TableHeadCell>
            <TableHeadCell>Department</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((v) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="">
                    <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                  </TableCell>
                  <TableCell className="">
                    <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                  </TableCell>
                  <TableCell className="">
                    <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                  </TableCell>
                  <TableCell className="">
                    <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                  </TableCell>
                  <TableCell className="">
                    <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                  </TableCell>
                  <TableCell className="">
                    <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                  </TableCell>
                  <TableCell className="">
                    <div className="w-[90%] animate-pulse bg-white rounded-full p-2"></div>
                  </TableCell>
                </TableRow>
              ))
            : employees && employees.length
            ? employees.map((item) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="">
                    <img alt={item.name} src={item?.photo} className="rounded-full w-10 h-10 aspect-square" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.email}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.designation}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.department?.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link to={`${ROUTES.APP.EMPLOYEE.split(":")[0]}${item?._id}`}>View</Link>
                  </TableCell>
                  <TableCell>
                    <Badge className="flex justify-center items-center capitalize" color="success">
                      {item?.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTableView;
