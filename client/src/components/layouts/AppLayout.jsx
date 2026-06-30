import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { IMAGES } from "src/assets";
import { ROUTES } from "src/utils/constants";
import MarkAttendance from "../MarkAttendance";
import {
  LuLayoutDashboard,
  LuCalendar1,
  LuBuilding2,
  LuFileUser,
  LuListTree,
  LuCalendarClock,
  LuCalendarX2,
  LuHandCoins,
  LuChartColumnBig,
  LuBriefcase,
  LuTrendingUp,
  LuFingerprint,
  LuGitPullRequestArrow,
  LuMegaphone,
  LuReceipt,
  LuLandmark,
  LuMonitorSmartphone,
  LuBuilding,
  LuShieldCheck,
  LuFileText,
  LuSettings,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { clearReducer } from "src/redux";
import PWAInstallButton from "../PWAInstallPrompt";

const NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", route: ROUTES.APP.HOME, Icon: LuLayoutDashboard },
      { label: "Reports", route: ROUTES.APP.REPORTS, Icon: LuChartColumnBig },
      { label: "Org Calendar", route: ROUTES.APP.CALENDAR, Icon: LuCalendar1 },
    ],
  },
  {
    section: "People",
    items: [
      { label: "Employees", route: ROUTES.APP.EMPLOYEES, Icon: LuFileUser },
      { label: "Departments", route: ROUTES.APP.DEPARTMENT, Icon: LuBuilding2 },
      { label: "Hierarchy", route: ROUTES.APP.HIERARCHY, Icon: LuListTree },
      { label: "Recruitment", route: ROUTES.APP.RECRUITMENT, Icon: LuBriefcase },
      { label: "Performance", route: ROUTES.APP.PERFORMANCE, Icon: LuTrendingUp },
    ],
  },
  {
    section: "Operations",
    items: [
      { label: "Attendance", route: ROUTES.APP.ATTENDANCE.ROOT, Icon: LuCalendarClock },
      { label: "Biometric", route: ROUTES.APP.BIOMETRIC, Icon: LuFingerprint },
      { label: "Leaves", route: ROUTES.APP.LEAVES, Icon: LuCalendarX2 },
      { label: "Approvals", route: ROUTES.APP.APPROVALS, Icon: LuGitPullRequestArrow },
      { label: "Announcements", route: ROUTES.APP.ANNOUNCEMENTS, Icon: LuMegaphone },
    ],
  },
  {
    section: "Finance",
    items: [
      { label: "Payroll", route: ROUTES.APP.PAYROLL, Icon: LuHandCoins },
      { label: "Expenses", route: ROUTES.APP.EXPENSES, Icon: LuReceipt },
      { label: "WPS Compliance", route: ROUTES.APP.WPS, Icon: LuLandmark },
      { label: "Assets", route: ROUTES.APP.ASSETS, Icon: LuMonitorSmartphone },
    ],
  },
  {
    section: "UAE & Org",
    items: [
      { label: "Branches", route: ROUTES.APP.BRANCHES, Icon: LuBuilding },
      { label: "UAE Compliance", route: ROUTES.APP.COMPLIANCE, Icon: LuShieldCheck },
      { label: "Documents", route: ROUTES.APP.DOCUMENTS, Icon: LuFileText },
      { label: "Settings", route: ROUTES.APP.SETTINGS, Icon: LuSettings },
    ],
  },
];

const isActiveRoute = (pathname, route) => (route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`));

const AppLayout = () => {
  const user = useSelector((state) => state.user);
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logout = () => {
    dispatch(clearReducer());
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className="fixed top-0 z-50 h-16 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button onClick={() => setsidebarOpen(!sidebarOpen)} className="mr-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none sm:hidden dark:text-gray-400 dark:hover:bg-gray-700">
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <Link to={ROUTES.APP.HOME} className="flex ms-2 md:me-24">
                <img src={IMAGES.logo} className="me-3 h-8" alt="here Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold sm:text-2xl dark:text-white">here</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <PWAInstallButton />
              {/* Super admins (company owners) don't punch attendance. */}
              {user?.isSuperAdmin ? null : <MarkAttendance />}
              <div className="flex items-center">
                <button type="button" className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full object-cover" src={user?.photo || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} alt="user photo" />
                </button>
                {userMenuOpen ? (
                  <div className="absolute right-4 top-14 z-50 my-4 list-none divide-y divide-gray-100 rounded-sm bg-white text-base shadow-sm dark:divide-gray-600 dark:bg-gray-700">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">{user.name}</p>
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-300">{user.email}</p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <p onClick={logout} className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                          Logout
                        </p>
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white pt-20 transition-transform sm:translate-x-0 dark:border-gray-700 dark:bg-gray-800 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-white px-3 pb-6 dark:bg-gray-800">
          {NAV.map((group) => (
            <div key={group.section} className="mb-4">
              <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{group.section}</p>
              <ul className="space-y-0.5">
                {group.items.map(({ label, route, Icon }) => {
                  const active = isActiveRoute(pathname, route);
                  return (
                    <li key={label}>
                      <Link
                        to={route}
                        onClick={() => setsidebarOpen(false)}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          active ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon size="1.15rem" className={active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"} />
                        <span>{label}</span>
                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <div className="mt-16 sm:ml-64">
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/60 p-4 sm:p-6 dark:bg-gray-900/40">
          <Outlet />
        </div>
      </div>
      {sidebarOpen ? <div onClick={() => setsidebarOpen(false)} className="fixed inset-0 z-30 bg-gray-900/50 sm:hidden dark:bg-gray-900/80" /> : null}
    </>
  );
};

export default AppLayout;
