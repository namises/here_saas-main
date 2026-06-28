import { onMessage } from "firebase/messaging";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "src/components/layouts/AppLayout";
import EmployeeApp from "./EmployeeApp";
import { isAdmin } from "src/utils/roles";
import { messaging } from "src/firebase";
import { updateToken } from "src/firebase/messaging";
import Attendance from "src/pages/app/Attendance";
import AttendanceDevices from "src/pages/app/AttendanceDevices";
import Calendar from "src/pages/app/Calendar";
import Department from "src/pages/app/Department";
import Employee from "src/pages/app/Employee";
import Employees from "src/pages/app/Employees";
import Hierarchy from "src/pages/app/Hierarchy";
import Home from "src/pages/app/Home";
import Leaves from "src/pages/app/Leaves";
import Payroll from "src/pages/app/Payroll";
import Settings from "src/pages/app/Settings";
import Branches from "src/pages/app/Branches";
import Assets from "src/pages/app/Assets";
import Expenses from "src/pages/app/Expenses";
import Announcements from "src/pages/app/Announcements";
import Recruitment from "src/pages/app/Recruitment";
import Performance from "src/pages/app/Performance";
import Documents from "src/pages/app/Documents";
import Approvals from "src/pages/app/Approvals";
import Compliance from "src/pages/app/Compliance";
import Wps from "src/pages/app/Wps";
import BiometricDevices from "src/pages/app/BiometricDevices";
import Reports from "src/pages/app/Reports";
import { ROUTES } from "src/utils/constants";

const App = () => {
  const user = useSelector((state) => state.user);

  useEffect(() => {
    updateToken();
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      // 🧠 Optionally show a custom in-app notification here
    });
  }, []);

  // Non-admin employees get the restricted self-service portal.
  if (!isAdmin(user)) return <EmployeeApp />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.APP.HOME} element={<Home />} />
        <Route path={ROUTES.APP.DEPARTMENT} element={<Department />} />
        <Route path={ROUTES.APP.EMPLOYEES} element={<Employees />} />
        <Route path={ROUTES.APP.EMPLOYEE} element={<Employee />} />
        <Route path={ROUTES.APP.ATTENDANCE.ROOT}>
          <Route index element={<Attendance />} />
          <Route path={ROUTES.APP.ATTENDANCE.DEVICES} element={<AttendanceDevices />} />
        </Route>
        <Route path={ROUTES.APP.LEAVES} element={<Leaves />} />
        <Route path={ROUTES.APP.PAYROLL} element={<Payroll />} />
        <Route path={ROUTES.APP.HIERARCHY} element={<Hierarchy />} />
        <Route path={ROUTES.APP.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.APP.CALENDAR} element={<Calendar />} />
        {/* New modules */}
        <Route path={ROUTES.APP.BRANCHES} element={<Branches />} />
        <Route path={ROUTES.APP.ASSETS} element={<Assets />} />
        <Route path={ROUTES.APP.EXPENSES} element={<Expenses />} />
        <Route path={ROUTES.APP.ANNOUNCEMENTS} element={<Announcements />} />
        <Route path={ROUTES.APP.RECRUITMENT} element={<Recruitment />} />
        <Route path={ROUTES.APP.PERFORMANCE} element={<Performance />} />
        <Route path={ROUTES.APP.DOCUMENTS} element={<Documents />} />
        <Route path={ROUTES.APP.APPROVALS} element={<Approvals />} />
        <Route path={ROUTES.APP.COMPLIANCE} element={<Compliance />} />
        <Route path={ROUTES.APP.WPS} element={<Wps />} />
        <Route path={ROUTES.APP.BIOMETRIC} element={<BiometricDevices />} />
        <Route path={ROUTES.APP.REPORTS} element={<Reports />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default App;
