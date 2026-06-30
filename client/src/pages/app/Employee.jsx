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
import { Button } from "flowbite-react";
import EmployeeProfileSections from "src/components/EmployeeProfileSections";
import EmployeeProfileEdit from "src/components/EmployeeProfileEdit";
import ProfileImageUpload from "src/components/ProfileImageUpload";
import { API } from "src/API/api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import { statusClass, titleCase } from "src/utils/ui";
export default function Employee() {
  const { id } = useParams() || {};

  const { employee, loading, getEmployee } = useEmployee(id);
  const { _id, name, email, mobile, organization, shift, isSuperAdmin, photo, bankAccount, pan, ifsc, permissions, isActive, dob, joiningDate, designation, empCode, department, manager, status, documents, _leaveMeta, leaveBalances, createdAt, updatedAt, benefits, ctcs, hierarchy, leaveRequests, payrolls, attendanceRequests } = employee || {};
  return loading ? (
    <p>Loading...</p>
  ) : (
    <Tabs variant="underline">
      <TabItem title="Profile" icon={HiUserCircle}>
        <Profile employee={employee} getEmployee={getEmployee} />
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

const Profile = ({ employee, getEmployee }) => {
  const e = employee || {};
  const [editing, setEditing] = useState(false);

  // Admin changes the photo → save immediately and refresh.
  const changePhoto = async (url) => {
    const res = await API.employee.update({ employeeId: e._id, photo: url });
    if (res?.success) {
      dispatchSnackbar("Photo updated", snackBarTypes.success);
      getEmployee();
    } else {
      dispatchSnackbar(res?.message || "Could not update photo", snackBarTypes.failure);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-800">
        <ProfileImageUpload value={e.photo} onChange={changePhoto} />
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{e.name}</h2>
          <p className="text-sm text-gray-400">{e.designation || "Employee"}</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            {e.empCode ? <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">#{e.empCode}</span> : null}
            {e.status ? <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusClass(e.status)}`}>{titleCase(e.status)}</span> : null}
          </div>
        </div>
        {!editing ? (
          <Button color="blue" size="sm" onClick={() => setEditing(true)}>
            <MdEdit className="mr-1.5" /> Edit details
          </Button>
        ) : null}
      </div>

      {editing ? (
        <EmployeeProfileEdit
          employee={e}
          onSaved={() => {
            setEditing(false);
            getEmployee();
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <EmployeeProfileSections employee={e} />
      )}
    </div>
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
