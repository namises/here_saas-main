"use client";

import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useEffect } from "react";
import SolidButton from "./SolidButton";
import NormalInput from "./NormalInput";
import useAddDepartment from "src/API/hooks/useAddDepartment";

export default function AddDepartmentForm({ isOpen, setIsOpen, getDepartments }) {
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setCode("");
      setDescription("");
    }
  }, [isOpen]);
  const onClose = () => {
    setIsOpen(false);
    getDepartments(1);
  };
  const { name, setName, code, setCode, description, setDescription, loading, handleAddDepartment, error } = useAddDepartment(onClose);
  return (
    <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={() => setIsOpen(false)}>
      <DrawerHeader title="Add New Department" titleIcon={() => null} />
      <DrawerItems>
        <div className="flex flex-col gap-y-4">
          <NormalInput label={"Name"} value={name} setter={setName} error={error.name} required />
          <NormalInput label={"Code"} value={code} setter={setCode} error={error.code} required />
          <NormalInput label={"Description"} value={description} setter={setDescription} error={error.description} />
          <div className="mb-6">
            <SolidButton title={"Add"} loading={loading} onClick={handleAddDepartment} className="w-full" />
          </div>
        </div>
      </DrawerItems>
    </Drawer>
  );
}
