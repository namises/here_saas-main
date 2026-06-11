import React from "react";
import { Badge, Card } from "flowbite-react";
import { Link } from "react-router-dom";
import { ROUTES } from "src/utils/constants";

const EmployeeCardView = ({ employees, loading }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      {loading
        ? [1, 2, 3, 4].map((v) => <Card className="animate-pulse w-sm"></Card>)
        : employees && employees.length
        ? employees.map((item) => (
            <Link to={`${ROUTES.APP.EMPLOYEE.split(":")[0]}${item?._id}`} className="w-full">
              <Card className="w-full">
                <div className="flex justify-start items-center gap-4">
                  <img alt={item.name} src={item?.photo} className="rounded-full w-20 h-20 aspect-square" />
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">{item?.name}</h5>
                      <Badge color="success" className="capitalize flex justify-center items-center">
                        {item?.status}
                      </Badge>
                    </div>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.email}</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.designation}</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.department?.name}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        : null}
    </div>
  );
};

export default EmployeeCardView;
