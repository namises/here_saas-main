import { Card, Dropdown, DropdownItem } from "flowbite-react";

export default function DepartmentCard({ _id, name, code, description }) {
  return (
    <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-sm bg-white shadow rounded">
      <div className="flex flex-col items-center">
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{code}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{description}</span>
      </div>
    </Card>
  );
}

export const DepartmentCardLoading = () => {
  return (
    <Card className="animate-pulse w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-sm bg-white shadow rounded">
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-sm bg-white shadow rounded">
        {/* <div className={"w-[60vw] aspect-square flex flex-row justify-end items-end text-bottom bg-slate-300"}></div>
      <div className="flex-grow">
        <div className="rounded-full m-1 px-2 h-4 w-[30vw] bg-slate-300 font-bold"></div>
        <div className="rounded-full m-1 mt-5 px-2 h-3 w-[40vw] bg-slate-300 font-bold"></div>
        <div className="rounded-full m-1 mt-1 px-2 h-3 w-[58vw] bg-slate-300 font-bold"></div>
        <div className="rounded-full m-1 mt-1 px-2 h-3 w-[40vw] bg-slate-300 font-bold"></div>
        <div className="rounded-full m-1 px-2 h-3 w-[30vw] bg-slate-300 font-bold"></div>
      </div>
      <a className="w-full justify-center text-center font-light bg-slate-300 py-3 px-6 text-white"></a> */}
      </div>
    </Card>
  );
};
