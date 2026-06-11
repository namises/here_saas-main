import { Badge, Card, Spinner } from "flowbite-react";
import { days } from "src/utils/constants";

const ShiftTimings = ({ shifts, loading }) => {
  return (
    <Card className=" w-full">
      <h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">Shift Timings</h5>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Details of working shifts according to which Attendance will be processed</p>
      {loading ? (
        <div className="flex justify-center items-center py-15">
          <Spinner />
        </div>
      ) : shifts && shifts.length ? (
        <ul className="my-4 space-y-3">
          {shifts.map(({ name, startTime, endTime, isOvernight, gracePeriodMins }) => (
            <li>
              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                <div className="flex items-center justify-between">
                  <span className="whitespace-nowrap text-base font-bold">{name}</span>
                  <span className="text-xs">{`${startTime} - ${endTime}`}</span>
                </div>
                <div className="flex mt-1 items-center justify-between">
                  <span className="text-xs">{`Grace - ${gracePeriodMins} Mins`}</span>
                  <span className="text-xs">{`Overnight - ${isOvernight ? "Yes" : "No"}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900 text-xs dark:text-gray-400 text-center">No Shifts Added</p>
      )}
    </Card>
  );
};

export default ShiftTimings;
