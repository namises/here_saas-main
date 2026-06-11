import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useCallback, useMemo, useState } from "react";

import SolidButton from "./SolidButton";
import useAddEmployee from "src/API/hooks/useAddEmployee";
import NormalInput from "./NormalInput";

import DepartmentSearchDropdown from "./DepartmentSearchDropdown";
import EmployeeSearchDropdown from "./EmployeeSearchDropdown";
import DateInput from "./DateInput";
import ShiftSearchDropdown from "./ShiftSearchDropdown";
import FileUpload from "./FileUpload";
import { v4 as uuidv4 } from "uuid";

const docTemplate = {
  name: "",
  url: "",
  type: "",
};

export default function AddEmployeeForm({ isOpen, setIsOpen, getEmployees }) {
  const handleClose = () => {
    setIsOpen(false);
    getEmployees();
  };
  const [name, set_name] = useState("");
  const [email, set_email] = useState("");
  const [dob, set_dob] = useState("");
  const [empCode, set_empCode] = useState("");
  const [mobile, set_mobile] = useState("");
  const [designation, set_designation] = useState("");
  const [department, set_department] = useState("");
  const [manager, set_manager] = useState("");
  const [password, set_password] = useState("");
  const [documents, set_documents] = useState([
    {
      name: "",
      url: "",
      type: "",
    },
  ]);
  const [joiningDate, set_joiningDate] = useState("");
  const [shift, set_shift] = useState("");
  const [pan, set_pan] = useState("");
  const [photo, set_photo] = useState("");
  const [photoType, setPhotoType] = useState("");
  const [photoName, setPhotoname] = useState("");
  const [bankAccount, set_bankAccount] = useState("");
  const [ifsc, set_ifsc] = useState("");

  const { loading, handleAddEmployee, error } = useAddEmployee(name, email, dob, shift, empCode, mobile, designation, department, manager, password, documents, joiningDate, pan, photo, bankAccount, ifsc, handleClose);

  return (
    <>
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={handleClose}>
        <DrawerHeader title="Add New Employee" titleIcon={() => null} />
        <DrawerItems>
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row justify-center gap-4 p-4 mb-4">
              <div className="w-1/2">
                <p className="text-gray-100 font-bold mb-4 col-span-3 text-center">Photo</p>
                <FileUpload value={photo} type={photoType} setter={set_photo} name={photoName} setname={setPhotoname} settype={setPhotoType} />
              </div>
            </div>
            <NormalInput label={"Name"} value={name} setter={set_name} error={error.orgName} required />
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
              <NormalInput label={"Pan"} value={pan} setter={set_pan} error={error.pan} />
              <NormalInput label={"IFSC"} value={ifsc} setter={set_ifsc} error={error.ifsc} />
            </div>
            <div className="flex flex-row gap-4">
              <NormalInput label={"Bank Account"} value={bankAccount} setter={set_bankAccount} error={error.bankAccount} />
            </div>
            <div className="flex flex-row gap-4">
              <ShiftSearchDropdown value={shift} setter={set_shift} />
              <NormalInput label={"Password"} value={password} setter={set_password} error={error.password} required />
            </div>
            <div className="border-2 rounded-md p-4 border-gray-400">
              <p className="text-gray-100 font-bold mb-4 col-span-3">Documents</p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-4">{documents && documents.length ? documents.map((doc, index) => <DocTile index={index} doc={doc} documents={documents} set_documents={set_documents} />) : <p className="text-gray-400 col-span-3 text-center">No Documents</p>}</div>
              <SolidButton title={"Add Document"} onClick={() => set_documents([...documents, { ...docTemplate }])} loading={loading} className="w-full" />
            </div>
            <div className="my-6 ">
              <SolidButton title={"Add"} onClick={handleAddEmployee} loading={loading} className="w-full" />
            </div>
          </div>
        </DrawerItems>
      </Drawer>
    </>
  );
}

const DocTile = ({ doc, documents, set_documents, index }) => {
  const { name, url, type } = doc;

  const handleUrlUpdate = (v) => {
    const temp = [...documents];

    if (v === "delete") {
      temp[index] = null;
      set_documents([...temp.filter((v) => v)]);
    } else {
      const type = v.split(".")[v.split(".").length - 1];
      temp[index]["url"] = v;
      set_documents([...temp]);
      handleTypeUpdate(type);
    }
  };

  const handleNameUpdate = (v) => {
    const temp = [...documents];
    temp[index]["name"] = v;
    set_documents([...temp]);
  };

  const handleTypeUpdate = (v) => {
    const temp = [...documents];
    temp[index]["type"] = v;
    set_documents([...temp]);
  };

  return (
    <div>
      <FileUpload id={index} value={url} type={type} setter={handleUrlUpdate} name={name} setname={handleNameUpdate} settype={handleTypeUpdate} />
      <NormalInput label={"Name"} required={true} value={name} setter={handleNameUpdate} />
      <NormalInput label="Type" required={true} value={type} setter={handleTypeUpdate} />
    </div>
  );
};
