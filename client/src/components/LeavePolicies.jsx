import { Badge, Card, Spinner } from "flowbite-react";
import { MdEdit } from "react-icons/md";
import { days } from "src/utils/constants";

const LeavePolicies = ({ leavePolicies, loading, onClickUpdate }) => {
  return (
    <Card className=" w-full">
      <h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">Leave Policies</h5>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Details of Organization leave policies</p>
      {loading ? (
        <div className="flex justify-center items-center py-15">
          <Spinner />
        </div>
      ) : leavePolicies && leavePolicies.length ? (
        <ul className="my-4 space-y-3">
          {leavePolicies.map(({ leaveType, code, maxPerYear, accrualFrequency, carryForward, encashable, maxCarryForward, maxEncashable, applicableAfterMonths, _id }) => (
            <li>
              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="whitespace-nowrap text-base font-bold">{leaveType}</span>
                  <div className="flex items-center justify-end gap-2">
                    <span className="whitespace-nowrap text-base font-bold">{`${code}`}</span>
                    <MdEdit className="cursor-pointer" onClick={() => onClickUpdate({ leaveType, code, maxPerYear, accrualFrequency, carryForward, encashable, maxCarryForward, maxEncashable, applicableAfterMonths, _id })} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs capitalize">{`${accrualFrequency}`}</p>
                  <p className="text-xs capitalize">{`Apllicable After ${applicableAfterMonths} Months`}</p>
                  <p className="text-xs">{`Yealry Granted - ${maxPerYear}`}</p>
                  <p className="text-xs">{`Carry Forward - ${maxCarryForward}`}</p>
                  <p className="text-xs">{`Encashable Forward - ${maxEncashable}`}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900 text-xs dark:text-gray-400 text-center">No Leave Policies Added</p>
      )}
    </Card>
  );
};

export default LeavePolicies;
