import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useState } from "react";
import SolidButton from "./SolidButton";
import NormalInput from "./NormalInput";
import useCreateLeavePolicy from "src/API/hooks/useCreateLeavePolicy";
import LeaveAccuralFrequencyDropdown from "./LeaveAccuralFrequencyDropdown";
import CheckBox from "./CheckBox";

export default function CreateLeavePolicyForm({ isOpen, handleClose, onCreate }) {
  const [leaveType, setLeaveType] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [maxPerYear, setMaxPerYear] = useState(0);
  const [accrualFrequency, setAccrualFrequency] = useState("");
  const [applicableAfterMonths, setApplicableAfterMonths] = useState(0);
  const [carryForward, setCarryForward] = useState(false);
  const [maxCarryForward, setMaxCarryForward] = useState("");
  const [encashable, setEncashable] = useState("");
  const [maxEncashable, setMaxEncashable] = useState("");

  const onAddedSuccessfully = () => {
    handleClose();
    onCreate();
  };

  const { handleCreateLeavePolicy, error, loading } = useCreateLeavePolicy(leaveType, code, description, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable, onAddedSuccessfully);
  return (
    <>
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={handleClose}>
        <DrawerHeader title="Create Leave Policy" titleIcon={() => null} />
        <DrawerItems>
          <div className="flex flex-col gap-y-4">
            <NormalInput label={"Leave Type"} value={leaveType} setter={setLeaveType} error={error.leaveType} required={true} />
            <NormalInput label={"Short Code"} value={code} setter={setCode} error={error.code} required={true} />
            <NormalInput label={"Description"} value={description} setter={setDescription} error={error.description} required={false} />
            <NormalInput label={"Max Per year"} value={maxPerYear} setter={setMaxPerYear} error={error.maxPerYear} required={true} type="number" />
            <LeaveAccuralFrequencyDropdown value={accrualFrequency} setter={setAccrualFrequency} required={true} error={error?.accrualFrequency} />
            <NormalInput label={"Applicable After Months"} value={applicableAfterMonths} setter={setApplicableAfterMonths} error={error.applicableAfterMonths} required={true} type="number" />
            <CheckBox label={"Carry Forward"} value={carryForward} setter={setCarryForward} error={error.carryForward} required={true} />
            {carryForward ? <NormalInput label={"Max Carry Forward"} value={maxCarryForward} setter={setMaxCarryForward} error={error.maxCarryForward} required={true} type="number" /> : null}
            <CheckBox label={"Encashable"} value={encashable} setter={setEncashable} error={error.encashable} required={false} />
            {encashable ? <NormalInput label={"Max Encashable"} value={maxEncashable} setter={setMaxEncashable} error={error.maxEncashable} required={true} type="number" /> : null}
            {/*
          <div className="flex flex-row gap-4">
            <NormalInput label={"Email"} value={email} setter={set_email} error={error.domain} required />
            <DateInput required={true} label={"Date of Birth "} value={dob} setter={set_dob} error={error.dob} />
          </div>
          <div className="flex flex-row gap-4">
            <NormalInput label={"Emp Code"} value={empCode} setter={set_empCode} error={error.name} required />
            <NormalInput label={"Mobile"} value={mobile} setter={set_mobile} error={error.email} required />
          </div>
          <div className="flex flex-row gap-4">
            <NormalInput label={"Designation"} value={designation} setter={set_designation} error={error.mobile} required />
            <DepartmentSearchDropdown value={department} setter={set_department} />
          </div>
          <div className="flex flex-row gap-4">
            <EmployeeSearchDropdown value={manager} setter={set_manager} label={"Manager"} />
            <DateInput required={true} label={"Date of Joining "} value={joiningDate} setter={set_joiningDate} error={error.joiningDate} />
          </div>
          <div className="flex flex-row gap-4">
            <ShiftSearchDropdown value={shift} setter={set_shift} />
            <NormalInput label={"Password"} value={password} setter={set_password} error={error.password} required />
          </div>
          */}
            <div className="mb-6">
              <SolidButton title={"Add"} onClick={handleCreateLeavePolicy} loading={loading} className="w-full" />
            </div>
            {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <a href="mailto:info@company.com" className="hover:underline">
                info@company.com
              </a>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <a href="tel:2124567890" className="hover:underline">
                212-456-7890
              </a>
            </p> */}
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
}
