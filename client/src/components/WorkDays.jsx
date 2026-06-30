import { Badge, Card, Spinner } from "flowbite-react";
import { LuSave } from "react-icons/lu";
import { days } from "src/utils/constants";
import SolidButton from "./SolidButton";

const WorkDays = ({ workDays, loading, setWorkDay, updateWorkDays, editable = true }) => {
  const canEdit = editable && typeof setWorkDay === "function";
  return (
    <Card className=" w-full">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">Working days</h5>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Details of working days according to which Attendance and Payroll will be processed{canEdit ? ". Tap a day to toggle." : ""}</p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-15">
          <Spinner />
        </div>
      ) : workDays && workDays.length === 7 ? (
        <>
          <ul className="my-4 space-y-3">
            {workDays.map((working, index) => (
              <li key={index}>
                <div
                  onClick={canEdit ? () => setWorkDay(!working, index) : undefined}
                  className={`group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 ${canEdit ? "cursor-pointer select-none" : ""}`}
                >
                  <span className="ml-3 flex-1 whitespace-nowrap">{days[index]}</span>
                  {working ? <Badge color="success">Workday</Badge> : <Badge color="warning">Weekoff</Badge>}
                </div>
              </li>
            ))}
          </ul>
          {canEdit ? (
            <div className="flex justify-end">
              <SolidButton title="Save" Icon={LuSave} loading={loading} onClick={updateWorkDays} />
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-gray-900 text-xs dark:text-gray-400 text-center">No Work days set</p>
      )}
    </Card>
  );
};

export default WorkDays;
