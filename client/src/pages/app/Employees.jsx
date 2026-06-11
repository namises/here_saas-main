import React, { useState } from "react";

import { MdAdd, MdFilterAlt, MdPersonAddAlt1 } from "react-icons/md";
import SolidButton from "src/components/SolidButton";
import AddEmployeeForm from "src/components/AddEmployeeForm";
import useEmployees from "src/API/hooks/useEmployees";
import useIsMobile from "src/hooks/useIsMobile";
import EmployeeCardView from "src/components/EmployeeCardView";
import EmployeeTableView from "src/components/EmployeeTableView";
import { Pagination } from "flowbite-react";
import EmployeeFilter from "src/components/EmployeeFilter";
import { useDebouncedState } from "src/hooks/useDebounce";

const Employees = () => {
  const [department, setDepartent] = useState(null);
  const [manager, setManager] = useState(null);
  const [search, setSearch] = useDebouncedState("", 1000);
  const [status, setStatus] = useState(null);
  const { employees, loading, error, refresh, page, setPage, totalPages } = useEmployees(search, search, null, search, search, department, search, manager, status);
  const isMobile = useIsMobile();
  const [isAddEmployeeFormOpen, setIsAddEmployeeFormOpen] = useState(false);
  const openAddEmployeeForm = () => setIsAddEmployeeFormOpen(true);
  const [showFilter, setShowFilter] = useState(isMobile ? false : true);
  const clearFilter = () => {
    setDepartent(null);
    setManager(null);
    setSearch("");
    setStatus("");
  };

  return (
    <>
      <div className="flex flex-row justify-end items-center gap-5 mb-5 text-2xl text-white">
        <SolidButton Icon={MdAdd} title="Add" onClick={openAddEmployeeForm} />
        <SolidButton Icon={MdFilterAlt} title="Filter" onClick={() => setShowFilter(!showFilter)} />
      </div>

      {showFilter ? (
        <EmployeeFilter
          //
          clearFilter={clearFilter}
          setStatus={setStatus}
          status={status}
          department={department}
          setDepartent={setDepartent}
          manager={manager}
          setManager={setManager}
          search={search}
          setSearch={setSearch}
          openAddEmployeeForm={openAddEmployeeForm}
        />
      ) : null}
      <AddEmployeeForm isOpen={isAddEmployeeFormOpen} setIsOpen={setIsAddEmployeeFormOpen} getEmployees={refresh} />
      {isMobile ? <EmployeeCardView employees={employees} loading={loading} /> : <EmployeeTableView employees={employees} loading={loading} />}
      {totalPages && totalPages > 1 ? (
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} showIcons />
        </div>
      ) : null}
    </>
  );
};

export default Employees;
