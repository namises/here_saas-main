import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, Carousel, TabItem, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard, MdEdit } from "react-icons/md";
import NormalInput from "src/components/NormalInput";
import DateInput from "src/components/DateInput";
import DepartmentSearchDropdown from "src/components/DepartmentSearchDropdown";
import EmployeeSearchDropdown from "src/components/EmployeeSearchDropdown";
import SolidButton from "src/components/SolidButton";
import CustomDocViewer from "src/components/CustomDocViewer";
import AddCTCForm from "src/components/AddCTCForm";
import UpdateCTCForm from "src/components/UpdateCTCForm";
import { formatTimestampToHumandate } from "src/utils";
import usePermission from "src/API/hooks/usePermission";
import CheckBox from "src/components/CheckBox";
import useUpdateEmployee from "src/API/hooks/useUpdateEmployee";
import useEmployee from "src/API/hooks/useEmployee";
import TestPreTag from "src/components/TestPreTag";
export default function Employee() {
  const { id } = useParams() || {};

  const { employee, loading, getEmployee } = useEmployee(id);
  const { _id, name, email, mobile, organization, shift, isSuperAdmin, photo, bankAccount, pan, ifsc, permissions, isActive, dob, joiningDate, designation, empCode, department, manager, status, documents, _leaveMeta, leaveBalances, createdAt, updatedAt, benefits, ctcs, hierarchy, leaveRequests, payrolls, attendanceRequests } = employee || {};
  return loading ? (
    <p>Loading...</p>
  ) : (
    <Tabs variant="underline">
      <TabItem title="Profile" icon={HiUserCircle}>
        <Profile {...{ _id, name, email, mobile, isSuperAdmin, isActive, dob, photo, bankAccount, pan, ifsc, joiningDate, designation, empCode, department, manager, status }} />
      </TabItem>
      <TabItem title="Documents" icon={MdDashboard}>
        <Documents documents={documents} />
      </TabItem>
      <TabItem active title="Permissions" icon={HiAdjustments}>
        {/* <pre>{JSON.stringify(employee, null, 2)}</pre> */}
        <Permissions permissions={permissions} employeeId={_id} getEmployee={getEmployee} />
      </TabItem>
      <TabItem title="CTC" icon={HiClipboardList}>
        <CTC ctcs={ctcs} getEmployee={getEmployee} employeeId={_id} />
      </TabItem>
    </Tabs>
  );
}

const Profile = ({ _id, name, email, mobile, isSuperAdmin, isActive, photo, bankAccount, pan, ifsc, dob, joiningDate, designation, empCode, department, manager, status }) => {
  return (
    <>
      <div className="p-4 flex justify-center mb-4 items-center gap-x-2">
        <img src={photo} className={`w-52 rounded-full border-4 ${status === "active" ? "border-green-700" : "border-yellow-700"}`} alt={name} srcset="" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 bg-gray-600 rounded-md p-4 justify-center items-center">
        <NormalInput disabled={true} label={"Employee Code"} value={empCode} />
        <NormalInput disabled={true} label="Name" value={name} />
        <NormalInput disabled={true} label="Email" value={email} />
        <NormalInput disabled={true} label="Mobile" value={mobile} />
        <DateInput disabled={true} label={"Date Of Birth"} value={dob} />
        <DateInput disabled={true} label={"Date Of Joining"} value={joiningDate} />
        <NormalInput disabled={true} label={"Designation"} value={designation} />
        <DepartmentSearchDropdown disabled={true} label={"Department"} value={department?._id} />
        <EmployeeSearchDropdown disabled={true} label={"Manager"} value={manager?._id} />
        <NormalInput disabled={true} label={"PAN"} value={pan} />
        <NormalInput disabled={true} label={"Bank Account"} value={bankAccount} />
        <NormalInput disabled={true} label={"IFSC"} value={ifsc} />
      </div>
      {/* <pre>{JSON.stringify(employee, null, 2)}</pre>; */}
    </>
  );
};
const Documents = ({ documents }) => {
  return documents && documents.length ? (
    <div className="w-full h-[60vh] md:h-[80vh]">
      <Carousel slide={false}>
        {documents.map((d) => (
          <div className="h-full">
            <CustomDocViewer fileUrl={d.url} name={d.name} />
          </div>
        ))}
      </Carousel>
    </div>
  ) : null;
};

const CTC = ({ ctcs, getEmployee, employeeId }) => {
  const [isCTCAddFormOpen, setIsCTCAddFromOpen] = useState(false);
  const [isCTCUpdateFormOpen, setIsCTCUpdateFromOpen] = useState(false);

  return (
    <div className="w-full h-[60vh] md:h-[80vh]">
      {isCTCAddFormOpen ? <AddCTCForm isOpen={isCTCAddFormOpen} setIsOpen={setIsCTCAddFromOpen} getEmployee={getEmployee} employeeId={employeeId} /> : null}
      {isCTCUpdateFormOpen ? <UpdateCTCForm isOpen={isCTCUpdateFormOpen} setIsOpen={setIsCTCUpdateFromOpen} getEmployee={getEmployee} /> : null}
      <div className="flex justify-end">
        <SolidButton title={"Create"} onClick={() => setIsCTCAddFromOpen(true)} />
      </div>
      <div className="grid mt-5 grid-cols-1 xl:grid-cols-3 items-stretch gap-3 py-2">
        {ctcs && ctcs.length
          ? ctcs.map(({ _id, organization, employee, financialYear, totalCTC, earnings, deductions, effectiveFrom, effectiveTill, remarks }) => (
              <div key={_id} className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col relative">
                <Card className="relative shadow-none border-none">
                  <div className="absolute flex gap-x-2 top-2 right-2 z-30">
                    <MdEdit
                      className="text-red-600 text-2xl cursor-pointer bg-white rounded-full p-1 shadow-md border"
                      onClick={() =>
                        setIsCTCUpdateFromOpen({
                          _id,
                          organization,
                          employee,
                          financialYear,
                          totalCTC,
                          earnings,
                          deductions,
                          effectiveFrom,
                          effectiveTill,
                          remarks,
                        })
                      }
                    />
                  </div>
                  <h5 className="font-semibold text-gray-900 lg:text-xl dark:text-white">{financialYear}</h5>
                  <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{`${formatTimestampToHumandate(effectiveFrom)} - ${effectiveTill ? formatTimestampToHumandate(effectiveTill) : "Now"}`}</p>
                  {[...earnings, ...deductions] && [...earnings, ...deductions].length ? (
                    <ul className="my-4 space-y-3">
                      {[...earnings, ...deductions].map(({ name, annualAmount, type, inHandComponent }, index) => (
                        <li>
                          <div className="group flex items-center justify-between rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                            <div className="flex items-center gap-x-2">
                              <span className="whitespace-nowrap">{`${name}`}</span>
                              <span className="text-sm font-normal">{inHandComponent ? `${"In-hand"}` : ""}</span>
                              <span className="text-sm font-normal capitalize">{type}</span>
                            </div>
                            <span className="whitespace-nowrap">{`${annualAmount}`}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No Components</p>
                  )}
                  <div className="group w-full flex items-center justify-between rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
                    <span className="whitespace-nowrap">{"Total"}</span>
                    <span className="whitespace-nowrap">{totalCTC}</span>
                  </div>
                </Card>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

const Permissions = ({ permissions, employeeId, getEmployee }) => {
  const [newPermissions, setNewPermissions] = useState([]);

  const { handleUpdateEmployee, loading, error } = useUpdateEmployee(employeeId, getEmployee);

  const { permissions: permissionsPreset } = usePermission();

  const handleToggle = (permKey) => {
    setNewPermissions((prev) => (prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]));
  };

  const renderCategory = (categoryKey, categoryValue) => {
    return Object.entries(categoryValue).map(([key, value]) => {
      if (typeof value === "string") {
        const isChecked = newPermissions.includes(value);
        return (
          <div key={value} className="ml-4 mb-2">
            <CheckBox label={`${key}`} value={isChecked} setter={() => handleToggle(value)} error={false} required={false} />
          </div>
        );
      } else if (typeof value === "object") {
        return (
          <div key={key} className="ml-2">
            <div className="font-semibold mt-3">{key}</div>
            {renderCategory(`${categoryKey}.${key}`, value)}
          </div>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    if (permissions && permissions.length) {
      setNewPermissions([...permissions]);
    }
  }, [permissions]);

  const same = useMemo(() => newPermissions?.length === permissions?.length && newPermissions.every((item) => permissions.includes(item)), [newPermissions, permissions]);

  return (
    <div className="shadow-md rounded-md">
      <div className="p-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 text-gray-300 capitalize">
        {Object.entries(permissionsPreset).map(([category, perms]) => (
          <div key={category} className="mb-4 break-inside-avoid rounded-lg bg-gray-800 p-4 shadow">
            <div className="text-lg font-bold mb-2">{category}</div>
            {renderCategory(category, perms)}
          </div>
        ))}
      </div>
      <div className="flex gap-x-4 items-center justify-end p-4">{same ? null : <SolidButton onClick={() => handleUpdateEmployee({ permissions: newPermissions })} title={"Update"} />}</div>
    </div>
  );
};
