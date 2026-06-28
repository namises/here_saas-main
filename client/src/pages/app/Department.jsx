import React, { useState } from "react";
import { Pagination } from "flowbite-react";
import { HiUserAdd } from "react-icons/hi";
import { MdAdd } from "react-icons/md";
import useDepartments from "src/API/hooks/useDepartments";
import AddDepartmentForm from "src/components/AddDepartmentForm";
import DepartmentCardView from "src/components/DepartmentCardView";
import DepartmentTableView from "src/components/DepartmentTableView";
import SolidButton from "src/components/SolidButton";
import useIsMobile from "src/hooks/useIsMobile";

const Department = () => {
  const isMobile = useIsMobile();
  const [isAddDepartmentFormOpen, setIsAddDepartmentFormOpen] = useState(false);
  const openDepartmentForm = () => setIsAddDepartmentFormOpen(true);
  const { departments, totalPages, page, setPage, limit, setLimit, loading, getDepartments } = useDepartments();

  return (
    <>
      <div className="flex flex-row justify-end items-center gap-5 mb-5 text-2xl text-white">
        <SolidButton Icon={MdAdd} title="Add" onClick={openDepartmentForm} />
      </div>

      <AddDepartmentForm getDepartments={getDepartments} isOpen={isAddDepartmentFormOpen} setIsOpen={setIsAddDepartmentFormOpen} />
      {isMobile ? <DepartmentCardView departments={departments} loading={loading} /> : <DepartmentTableView departments={departments} loading={loading} />}
      {totalPages && totalPages > 1 ? (
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} showIcons />
        </div>
      ) : null}
    </>
  );
};

export default Department;
