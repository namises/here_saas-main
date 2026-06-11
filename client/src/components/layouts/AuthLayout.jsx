import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Card } from "flowbite-react";
import { ROUTES } from "src/utils/constants";
// Adjust the path as needed

export default function AuthLayout() {
  const location = useLocation();
  const path = location.pathname;
  const getActiveClass = ({ isActive }) => `text-sm font-medium ${isActive ? "text-white border-b-2 border-blue-gray" : "text-gray-500 hover:text-white-900"} pb-1`;

  const isLoginPage = path === ROUTES.AUTH.LOGIN;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[90svw] sm:w-[500px] my-10  p-2 rounded-2xl shadow-lg">
        <h3 className="text-center text-white">{isLoginPage ? "Login" : "Register"}</h3>
        <Outlet />
        <div className="flex justify-center">
          {isLoginPage ? (
            <span className="text-gray-600 text-xs">
              Not Registerd
              <NavLink className={"text-xs font-bold text-blue-400 hover:text-white"} to={ROUTES.AUTH.REGISTER}>
                {" Register"}
              </NavLink>
            </span>
          ) : (
            <span className="text-gray-600 text-xs">
              Already have an account?
              <NavLink className={"text-xs font-bold text-blue-400 hover:text-white"} to={ROUTES.AUTH.LOGIN}>
                {" Login"}
              </NavLink>
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
