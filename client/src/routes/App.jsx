import { onMessage } from "firebase/messaging";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "src/components/layouts/AppLayout";
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
import { ROUTES } from "src/utils/constants";

const App = () => {
  useEffect(() => {
    updateToken();
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      // 🧠 Optionally show a custom in-app notification here
    });
  }, []);

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
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default App;
