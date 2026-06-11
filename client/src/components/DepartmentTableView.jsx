import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { Link } from "react-router-dom";
import { ROUTES } from "src/utils/constants";

const DepartmentTableView = ({ departments, loading }) => {
  return (
    <div className="overflow-x-auto mt-5 rounded-md">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Code</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
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
                </TableRow>
              ))
            : departments && departments.length
            ? departments.map((item) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.code}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.description}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Link to={`/`}>Edit</Link>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentTableView;
