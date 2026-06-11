import React from "react";
import NormalInput from "./NormalInput";
import CheckBox from "./CheckBox";
import SolidButton from "./SolidButton";
import TimeInput from "./TimeInput";
import { MdCheck, MdClose } from "react-icons/md";
import ShiftCard from "./ShiftCard";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { days } from "src/utils/constants";
import DateInput from "./DateInput";
import HolidayCard from "./HolidayCard";

const ShiftSelector = ({
  //
  holidays,
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  onClickAddHoliday,
  onClickDeleteholidayInCreation,
  holidayInCreation,
  setHolidayInCreation,
  holidayLoading,
  holidayError,
  isOpen,
  setIsOpen,
  shifts,
  createShift,
  updateShift,
  deleteShift,
  onClickAddShift,
  onClickDeleteShiftInCreation,
  shiftInCreation,
  setShiftInCreation,
  loading,
  shiftError,
  workDays,
  setWorkDay,
  updateWorkDays,
  loadingWorkDays,
}) => {
  return (
    <>
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerHeader title="Set time schedule" titleIcon={() => null} />
        <DrawerItems>
          <div className="mt-10">
            <div className="grid grid-cols-4">
              <h5 className="inline-flex items-center col-span-4 mb-6 text-base font-semibold text-gray-500 dark:text-gray-400">Working Days</h5>
              {workDays.map((working, index) => (
                <CheckBox label={days[index]} value={working} setter={(v) => setWorkDay(v.target.checked, index)} />
              ))}
            </div>
            <SolidButton title={"Save Working Days"} className="w-full" onClick={updateWorkDays} loading={loadingWorkDays} />
            <h5 className="inline-flex items-center  mt-10 text-base font-semibold text-gray-500 dark:text-gray-400">Shifts</h5>
            {shifts && shifts.length ? shifts.map((shift) => <ShiftCard {...shift} updateShift={updateShift} deleteShift={deleteShift} />) : <p className="text-gray-200 mb-5 text-center">No Shifts Added</p>}
            {shiftInCreation ? (
              <>
                <div className="flex flex-col gap-2 border-2 mt-5 border-gray-500 rounded-md p-3 mb-4">
                  <div className="flex justify-end items-center text-2xl gap-3">
                    <MdCheck onClick={createShift} className="text-green-600 cursor-pointer" />
                    <MdClose onClick={onClickDeleteShiftInCreation} className="text-red-600 cursor-pointer" />
                  </div>
                  <NormalInput disabled={false} error={shiftError?.name} required label={"Shift Name"} value={shiftInCreation?.name} setter={(name) => setShiftInCreation({ ...shiftInCreation, name })} />
                  <div className="flex mb-2 gap-2 items-center h-full ">
                    <NormalInput label={"Grace in minutes (0-60)"} type="number" value={shiftInCreation?.gracePeriodMins} setter={(gracePeriodMins) => setShiftInCreation({ ...shiftInCreation, gracePeriodMins })} />
                    <TimeInput value={shiftInCreation?.startTime} setter={(startTime) => setShiftInCreation({ ...shiftInCreation, startTime })} label={"Start Time"} required error={shiftError?.startTime} />
                    <TimeInput value={shiftInCreation?.endTime} setter={(endTime) => setShiftInCreation({ ...shiftInCreation, endTime })} label={"End Time"} required error={shiftError?.endTime} />
                    <TimeInput value={shiftInCreation?.minHalfDayDuration} setter={(minHalfDayDuration) => setShiftInCreation({ ...shiftInCreation, minHalfDayDuration })} label={"Min Half Day Duration"} required error={shiftError?.minHalfDayDuration} />
                    <TimeInput value={shiftInCreation?.minFullDayDuration} setter={(minFullDayDuration) => setShiftInCreation({ ...shiftInCreation, minFullDayDuration })} label={"Min Full day Duration"} required error={shiftError?.minFullDayDuration} />
                  </div>
                </div>
              </>
            ) : null}
            <button type="button" onClick={onClickAddShift} className="cursor-pointer inline-flex items-center justify-center w-full py-2.5 mb-4 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              <svg className="w-4 h-4 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
              </svg>
              Add Shift
            </button>
            <h5 className="inline-flex items-center  mt-10 text-base font-semibold text-gray-500 dark:text-gray-400">Holidays</h5>
            {holidays && holidays.length ? holidays.map((holiday) => <HolidayCard {...holiday} updateHoliday={updateHoliday} deleteHoliday={deleteHoliday} />) : <p className="text-gray-200 mb-5 text-center">No Holidays Added</p>}
            {holidayInCreation ? (
              <>
                <div className="flex flex-col gap-2 border-2 mt-5 border-gray-500 rounded-md p-3 mb-4">
                  <div className="flex justify-end items-center text-2xl gap-3">
                    <MdCheck onClick={createHoliday} className="text-green-600 cursor-pointer" />
                    <MdClose onClick={onClickDeleteholidayInCreation} className="text-red-600 cursor-pointer" />
                  </div>
                  <NormalInput disabled={false} error={holidayError?.name} required label={"Holiday Name"} value={holidayInCreation?.name} setter={(name) => setHolidayInCreation({ ...holidayInCreation, name })} />
                  <div className="flex mb-2 gap-2 items-center h-full ">
                    <DateInput required={true} label={"Date"} value={holidayInCreation.date} setter={(date) => setHolidayInCreation({ ...holidayInCreation, date })} />
                    <NormalInput disabled={false} error={holidayError?.remarks} label={"Remarks"} value={holidayInCreation?.remarks} setter={(remarks) => setHolidayInCreation({ ...holidayInCreation, remarks })} />
                  </div>
                </div>
              </>
            ) : null}
            <button type="button" onClick={onClickAddHoliday} className="cursor-pointer inline-flex items-center justify-center w-full py-2.5 mb-4 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              <svg className="w-4 h-4 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5" />
              </svg>
              Add Holiday
            </button>
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
};

export default ShiftSelector;
