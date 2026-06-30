import React, { useState } from "react";
import ShiftSelector from "src/components/ShiftSelector";
import { MdSettings } from "react-icons/md";
import SolidButton from "src/components/SolidButton";
import useWorkDays from "src/API/hooks/useWorkDays";
import useShift from "src/API/hooks/useShift";
import WorkDays from "src/components/WorkDays";
import ShiftTimings from "src/components/ShiftTimings";
import useHoliday from "src/API/hooks/useHoliday";
import Holidays from "src/components/Holidays";

const Calendar = () => {
  const [financialYear, setFinancialYear] = useState(null);
  const { workDays, setWorkDay, updateWorkDays, loading: loadingWorkDays } = useWorkDays();
  const { shifts, createShift, updateShift, deleteShift, onClickAddShift, onClickDeleteShiftInCreation, shiftInCreation, setShiftInCreation, loading, error: shiftError } = useShift();
  const { holidays, getHolidays, createHoliday, updateHoliday, deleteHoliday, onClickAddHoliday, onClickDeleteholidayInCreation, holidayInCreation, setHolidayInCreation, loading: holidayLoading, error: holidayError } = useHoliday(financialYear);
  const [isShiftSelectorOpen, setIsShiftSelectorOpen] = useState(false);
  const openShiftSelector = () => setIsShiftSelectorOpen(true);
  return (
    <>
      <div className="flex flex-row justify-end items-center">
        <SolidButton title="Settings" Icon={MdSettings} onClick={openShiftSelector} />
      </div>
      <ShiftSelector holidays={holidays} getHolidays={getHolidays} createHoliday={createHoliday} updateHoliday={updateHoliday} deleteHoliday={deleteHoliday} onClickAddHoliday={onClickAddHoliday} onClickDeleteholidayInCreation={onClickDeleteholidayInCreation} holidayInCreation={holidayInCreation} setHolidayInCreation={setHolidayInCreation} holidayLoading={holidayLoading} holidayError={holidayError} shifts={shifts} createShift={createShift} updateShift={updateShift} deleteShift={deleteShift} onClickAddShift={onClickAddShift} onClickDeleteShiftInCreation={onClickDeleteShiftInCreation} shiftInCreation={shiftInCreation} setShiftInCreation={setShiftInCreation} loading={loading} shiftError={shiftError} workDays={workDays} setWorkDay={setWorkDay} updateWorkDays={updateWorkDays} loadingWorkDays={loadingWorkDays} isOpen={isShiftSelectorOpen} setIsOpen={setIsShiftSelectorOpen} />
      <div className="grid mt-5 grid-cols-1 xl:grid-cols-3 justify-center gap-3 py-2">
        <div className="col-span-1">
          <WorkDays workDays={workDays} loading={loadingWorkDays} setWorkDay={setWorkDay} updateWorkDays={updateWorkDays} />
        </div>
        <div className="col-span-1">
          <ShiftTimings shifts={shifts} loading={loading} />
        </div>
        <div className="col-span-1">
          <Holidays financialYear={financialYear} setFinancialYear={setFinancialYear} holidays={holidays} loading={holidayLoading} />
        </div>
      </div>
    </>
  );
};

export default Calendar;
