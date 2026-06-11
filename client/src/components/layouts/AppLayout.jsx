import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IMAGES } from "src/assets";
import { ROUTES } from "src/utils/constants";
import MarkAttendance from "../MarkAttendance";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuCalendar1 } from "react-icons/lu";
import { LuBuilding2 } from "react-icons/lu";
import { LuFileUser } from "react-icons/lu";
import { LuListTree } from "react-icons/lu";
import { LuCalendarClock } from "react-icons/lu";
import { LuCalendarX2 } from "react-icons/lu";
import { LuHandCoins } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { clearReducer } from "src/redux";
import PWAInstallButton from "../PWAInstallPrompt";

const NavLinks = {
  Dashboard: { route: ROUTES.APP.HOME, Icon: LuLayoutDashboard },
  "Org Calendar": { route: ROUTES.APP.CALENDAR, Icon: LuCalendar1 },
  Department: { route: ROUTES.APP.DEPARTMENT, Icon: LuBuilding2 },
  Employees: { route: ROUTES.APP.EMPLOYEES, Icon: LuFileUser },
  Hierarchy: { route: ROUTES.APP.HIERARCHY, Icon: LuListTree },
  Attendance: { route: ROUTES.APP.ATTENDANCE.ROOT, Icon: LuCalendarClock },
  Leaves: { route: ROUTES.APP.LEAVES, Icon: LuCalendarX2 },
  Payroll: { route: ROUTES.APP.PAYROLL, Icon: LuHandCoins },
};

const subMenus = {
  Attendance: [{ route: ROUTES.APP.ATTENDANCE.DEVICES, Icon: LuHandCoins, label: "Devices" }],
};

const AppLayout = () => {
  const user = useSelector((state) => state.user);
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(clearReducer());
    navigate("/", {
      replace: true,
    });
  };
  return (
    <>
      <nav className="fixed top-0 z-50 w-full h-16 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <Link to={ROUTES.APP.HOME} className="flex ms-2 md:me-24">
                <img src={IMAGES.logo} className="h-8 me-3" alt="here Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">here</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <PWAInstallButton />
              <MarkAttendance />
              <div className="flex items-center">
                <div>
                  <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                    <span className="sr-only">Open user menu</span>
                    <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                  </button>
                </div>
                {userMenuOpen ? (
                  <div className="z-50 absolute top-14 right-4 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900 dark:text-white" role="none">
                        {user.name}
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                        {user.email}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <p onClick={logout} className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                          Logout
                        </p>
                      </li>
                      <li></li>
                    </ul>
                  </div>
                ) : null}
              </div>
              <button onClick={() => setsidebarOpen(!sidebarOpen)} className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <aside className={sidebarOpen ? `fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 transform-none` : `fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 -translate-x-full`} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">{Object.entries(NavLinks).map(([k, v]) => (subMenus[k] ? <SubMenuItem route={v.route} label={k} Icon={v.Icon} /> : <NormalItem route={v.route} label={k} Icon={v.Icon} />))}</ul>
        </div>
      </aside>
      <div className="mt-16 sm:ml-64 border border-white">
        <div className="m-5">
          <Outlet />
        </div>
      </div>
      {sidebarOpen ? <div onClick={() => setsidebarOpen(false)} className="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30"></div> : null}
    </>
  );
};

const NormalItem = ({ route, Icon, label }) => (
  <li>
    <Link to={route} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
      <Icon />
      <span className="ms-3">{label}</span>
    </Link>
  </li>
);

const BadgeItem = ({ route, Icon, label, badge }) => (
  <li>
    <Link to={route} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
      <Icon />
      <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
      <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">{badge}</span>
    </Link>
  </li>
);

const CountItem = ({ label, route, Icon, count }) => (
  <li>
    <Link to={route} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
      <Icon />
      <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
      <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{count}</span>
    </Link>
  </li>
);

const SubMenuItem = ({ label, route, Icon }) => {
  const subMenu = subMenus[label];
  const id = `${label}-dropdown`;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <li>
      <div className="flex items-center pr-3 w-full text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
        <Link to={route} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
          <Icon />
          <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{label}</span>
        </Link>
        <button className="flex items-center w-full justify-end cursor-pointer" type="button" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
      </div>
      {menuOpen ? (
        <ul id={id} className="py-2 space-y-2 ml-4">
          {subMenu.map(({ route, Icon, label }) => (
            <Link to={route} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <Icon />
              <span className="flex-1 ms-3 whitespace-nowrap">{label}</span>
            </Link>
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default AppLayout;
