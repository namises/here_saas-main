import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useEffect, useState } from "react";
import SolidButton from "./SolidButton";
import NormalInput from "./NormalInput";
import useCreateLeavePolicy from "src/API/hooks/useCreateLeavePolicy";
import LeaveAccuralFrequencyDropdown from "./LeaveAccuralFrequencyDropdown";
import CheckBox from "./CheckBox";
import useUpdateLeavePolicy from "src/API/hooks/useUpdateLeavePolicy";

export default function UpdateLeavePolicyForm({ isOpen, handleClose, onUpdate }) {
  const [leavePolicyId, setLeavePolicyId] = useState(null);
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

  const onUpdateSuccess = () => {
    handleClose();
    onUpdate();
  };

  const { handleUpdateLeavePolicy, error, loading } = useUpdateLeavePolicy(leavePolicyId, leaveType, code, description, maxPerYear, accrualFrequency, applicableAfterMonths, carryForward, maxCarryForward, encashable, maxEncashable, onUpdateSuccess);

  useEffect(() => {
    if (isOpen && isOpen._id) {
      const { leaveType, code, maxPerYear, accrualFrequency, carryForward, encashable, maxCarryForward, maxEncashable, applicableAfterMonths, _id } = isOpen;
      setLeavePolicyId(_id);
      setLeaveType(leaveType);
      setCode(code);
      setDescription(description);
      setMaxPerYear(maxPerYear);
      setAccrualFrequency(accrualFrequency);
      setApplicableAfterMonths(applicableAfterMonths);
      setCarryForward(carryForward);
      setMaxCarryForward(maxCarryForward);
      setEncashable(encashable);
      setMaxEncashable(maxEncashable);
    }
  }, [isOpen]);

  return (
    <>
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={handleClose}>
        <DrawerHeader title="Update Leave Policy" titleIcon={() => null} />
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
            <div className="mb-6">
              <SolidButton title={"Update"} onClick={handleUpdateLeavePolicy} loading={loading} className="w-full" />
            </div>
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
}
