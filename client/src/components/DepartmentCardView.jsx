import React from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

const DepartmentCardView = ({ departments, loading }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      {loading
        ? [1, 2, 3, 4].map((v) => <Card className="animate-pulse w-sm"></Card>)
        : departments && departments.length
        ? departments.map((item) => (
            <Link to={`/`} className="w-full">
              <Card className="w-full">
                <div className="flex justify-start items-center gap-4">
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">{item?.name}</h5>
                    </div>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.code}</p>
                    <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        : null}
    </div>
  );
};

export default DepartmentCardView;
