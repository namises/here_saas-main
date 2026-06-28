import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeLayout from "src/components/layouts/EmployeeLayout";
import EmployeeDashboard from "src/pages/employee/EmployeeDashboard";
import MyAttendance from "src/pages/employee/MyAttendance";
import MyProfile from "src/pages/employee/MyProfile";
import MyLeaves from "src/pages/employee/MyLeaves";
import Announcements from "src/pages/employee/Announcements";
import Holidays from "src/pages/employee/Holidays";
import Documents from "src/pages/employee/Documents";
import Reimbursements from "src/pages/employee/Reimbursements";
import Notes from "src/pages/employee/Notes";
import Alarm from "src/pages/employee/Alarm";
import Crm from "src/pages/employee/Crm";
import { ROUTES } from "src/utils/constants";

// Self-service portal shown to non-admin employees.
const EmployeeApp = () => (
  <Routes>
    <Route element={<EmployeeLayout />}>
      <Route path={ROUTES.EMPLOYEE.HOME} element={<EmployeeDashboard />} />
      <Route path={ROUTES.EMPLOYEE.ATTENDANCE} element={<MyAttendance />} />
      <Route path={ROUTES.EMPLOYEE.PROFILE} element={<MyProfile />} />
      <Route path={ROUTES.EMPLOYEE.LEAVES} element={<MyLeaves />} />
      <Route path={ROUTES.EMPLOYEE.ANNOUNCEMENTS} element={<Announcements />} />
      <Route path={ROUTES.EMPLOYEE.HOLIDAYS} element={<Holidays />} />
      <Route path={ROUTES.EMPLOYEE.DOCUMENTS} element={<Documents />} />
      <Route path={ROUTES.EMPLOYEE.REIMBURSEMENTS} element={<Reimbursements />} />
      <Route path={ROUTES.EMPLOYEE.NOTES} element={<Notes />} />
      <Route path={ROUTES.EMPLOYEE.ALARM} element={<Alarm />} />
      <Route path={ROUTES.EMPLOYEE.CRM} element={<Crm />} />
      <Route path="*" element={<EmployeeDashboard />} />
    </Route>
  </Routes>
);

export default EmployeeApp;
