import React from "react";
import { useSelector } from "react-redux";
import useHierarchy from "src/API/hooks/useHierarchy";
import HierarchyTree from "src/components/HierarchyTree";

const Hierarchy = () => {
  const { _id: employeeId } = useSelector((state) => state.user);
  const { hierarchy, loading, error } = useHierarchy(employeeId);
  return (
    <div className="flex flex-row justify-center px-8 items-center mt-5">
      <HierarchyTree data={hierarchy} />;
    </div>
  );
};

export default Hierarchy;
