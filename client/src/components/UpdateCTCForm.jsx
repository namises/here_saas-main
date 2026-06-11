import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useEffect, useState } from "react";
import SolidButton from "./SolidButton";
import NormalInput from "./NormalInput";
import DateInput from "./DateInput";
import FinancialYearDropdown from "./FinancialYearDropdown";
import CheckBox from "./CheckBox";

import { MdDelete } from "react-icons/md";
import useUpdateCTC from "src/API/hooks/useUpdateCTC";

const earningsTemplate = {
  name: "",
  annualAmount: 0,
  type: "earnings",
  inHandComponent: true,
};
const deductionsTemplate = {
  name: "",
  annualAmount: 0,
  type: "deductions",
  inHandComponent: true,
};

export default function UpdateCTCForm({ isOpen, setIsOpen, getEmployee }) {
  const handleClose = () => setIsOpen(false);
  const onCreate = () => {
    setIsOpen(false);
    getEmployee();
  };

  const [ctcId, setCtcId] = useState("");
  const [employee, setEmployee] = useState("");
  const [financialYear, set_financialYear] = useState("");
  const [earnings, set_earnings] = useState([{ ...earningsTemplate }]);
  const [deductions, set_deductions] = useState([{ ...deductionsTemplate }]);
  const [remarks, set_remarks] = useState(null);
  const [effectiveFrom, set_effectiveFrom] = useState(null);

  const { error, handleUpdateCTC, loading: loadingUpdateCTC } = useUpdateCTC(ctcId, employee, financialYear, earnings, deductions, remarks, effectiveFrom, onCreate);

  useEffect(() => {
    if (isOpen && isOpen._id) {
      console.log({ isOpen });
      setCtcId(isOpen._id);
      setEmployee(isOpen.employee);
      set_financialYear(isOpen.financialYear);
      set_earnings([...isOpen.earnings]);
      set_deductions([...isOpen.deductions]);
      set_remarks(isOpen.remarks);
      set_effectiveFrom(isOpen.effectiveFrom);
    }
  }, [isOpen]);

  return (
    <>
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={handleClose}>
        <DrawerHeader title="Update CTC" titleIcon={() => null} />
        <DrawerItems>
          <div className="flex flex-row gap-4">
            <DateInput required={true} label={"Effective From"} value={effectiveFrom} setter={set_effectiveFrom} error={error.effectiveFrom} />
            <FinancialYearDropdown value={financialYear} setter={set_financialYear} required={true} />
          </div>
          <div className="border-2 rounded-md p-4 mb-4 border-gray-400">
            <p className="text-gray-100 font-bold mb-4 col-span-3">Earnings</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-4">{earnings && earnings.length ? earnings.map((comp, index) => <ComponentTile index={index} comp={comp} components={earnings} set_components={set_earnings} />) : <p className="text-gray-400 col-span-3 text-center">No Earnings Component Added</p>}</div>
            <SolidButton title={"Add Earnings"} onClick={() => set_earnings([...earnings, { ...earningsTemplate }])} loading={false} className="w-full" />
          </div>
          <div className="border-2 rounded-md p-4 mb-4 border-gray-400">
            <p className="text-gray-100 font-bold mb-4 col-span-3">Deductions</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-4">{deductions && deductions.length ? deductions.map((comp, index) => <ComponentTile index={index} comp={comp} components={deductions} set_components={set_deductions} />) : <p className="text-gray-400 col-span-3 text-center">No Deductions Component Added</p>}</div>
            <SolidButton title={"Add Deduction"} onClick={() => set_deductions([...deductions, { ...deductionsTemplate }])} loading={false} className="w-full" />
          </div>
          <NormalInput label={"Remarks"} value={remarks} setter={set_remarks} error={error.remarks} required={true} />
          <div className="my-6 ">
            <SolidButton title={"Update"} onClick={handleUpdateCTC} loading={loadingUpdateCTC} className="w-full" />
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
}

const ComponentTile = ({ comp, components, set_components, index }) => {
  const { name, annualAmount, inHandComponent } = comp;

  const handleNameUpdate = (v) => {
    const temp = [...components];
    temp[index]["name"] = v;
    set_components([...temp]);
  };

  const handleAnnualAmountUpdate = (v) => {
    const temp = [...components];
    temp[index]["annualAmount"] = v;
    set_components([...temp]);
  };
  const handleInHandUpdate = (v) => {
    const temp = [...components];
    temp[index]["inHandComponent"] = v;
    set_components([...temp]);
  };

  const handleComponentDelete = () => {
    const temp = [...components];
    temp[index] = null;
    set_components([...temp.filter((v) => v)]);
  };

  return (
    <div className="relative border-2 rounded-md px-4 py-5 border-gray-400">
      <div className="absolute flex gap-x-2 top-2 right-2 z-30">
        <MdDelete className="text-red-600 text-2xl cursor-pointer bg-white rounded-full p-1 shadow-md border" onClick={handleComponentDelete} />
      </div>
      <NormalInput label={"Name"} required={true} value={name} setter={handleNameUpdate} />

      <NormalInput label="Annual Amount" required={true} value={annualAmount} setter={handleAnnualAmountUpdate} type="number" />
      <CheckBox label={"In Hand"} value={inHandComponent} setter={handleInHandUpdate} />
    </div>
  );
};
