import { Card, Spinner } from "flowbite-react";
import { formatTimestampToHumandate } from "src/utils";
import FinancialYearDropdown from "./FinancialYearDropdown";

const Holidays = ({ holidays, loading, financialYear, setFinancialYear }) => {
  return (
    <Card className=" w-full">
      <div className="flex justify-between items-center">
        <h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">Holidays</h5>
        <div className=" w-[50%]">
          <FinancialYearDropdown value={financialYear} setter={setFinancialYear} />
        </div>
      </div>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">List of holidays</p>
      {loading ? (
        <div className="flex justify-center items-center py-15">
          <Spinner />
        </div>
      ) : holidays && holidays.length ? (
        <ul className="my-4 space-y-3">
          {holidays.map(({ name, date, remarks }) => (
            <li>
              <div className="rounded-lg bg-gray-50 p-3 text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                <div className="flex items-center justify-between">
                  <span className="whitespace-nowrap text-base font-bold">{name}</span>
                  <span className="font-bold">{`${formatTimestampToHumandate(date)}`}</span>
                </div>
                <div className="flex mt-1 items-center justify-between">
                  <span className="text-xs">{`${remarks}`}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-900 text-xs dark:text-gray-400 text-center">No Holidays Added</p>
      )}
    </Card>
  );
};

export default Holidays;
