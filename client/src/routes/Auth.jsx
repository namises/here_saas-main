import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "src/components/layouts/AuthLayout";
import Login from "src/pages/auth/Login";
import Register from "src/pages/auth/Register";
import { ROUTES } from "src/utils/constants";
const Auth = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
        <Route path={ROUTES.AUTH.REGISTER} element={<Register />} />
      </Route>
    </Routes>
  );
};

export default Auth;
