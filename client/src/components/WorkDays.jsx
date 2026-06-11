import { Badge, Card, Spinner } from "flowbite-react";
import { days } from "src/utils/constants";

const WorkDays = ({ workDays, loading }) => {
  return (
    <Card className=" w-full">
      <h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">Working days</h5>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Details of working days according to which Attendance and Payroll will be processed</p>
      {loading ? (
        <div className="flex justify-center items-center py-15">
          <Spinner />
        </div>
      ) : workDays && workDays.length === 7 ? (
        <ul className="my-4 space-y-3">
          {workDays.map((working, index) => (
            <li>
              <div className="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                <span className="ml-3 flex-1 whitespace-nowrap">{days[index]}</span>
                {working ? <Badge color="success">Workday</Badge> : <Badge color="warning">Weekoff</Badge>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900 text-xs dark:text-gray-400 text-center">No Work days set</p>
      )}
    </Card>
  );
};

export default WorkDays;
