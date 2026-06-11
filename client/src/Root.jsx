import React from "react";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import store, { persistor } from "./redux";
import { SnackbarProvider } from "notistack";
import { ThemeConfig } from "flowbite-react";

import App from "./routes/App";
import Auth from "./routes/Auth";

import useIsLoggedIn from "./hooks/useIsLoggedIn";
import { ROUTES } from "./utils/constants";
import AttendanceDeviceLogin from "./pages/AttendanceDeviceLogin";
import AttendanceDeviceQR from "./pages/AttendanceDeviceQR";
import { storage } from "./utils/storage";
import useUpdateLocale from "./API/hooks/useUpdateLocale";

const RootProviderHoc = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

const Root = () => {
  useUpdateLocale();
  const { isLoggedIn } = useIsLoggedIn();

  return (
    <>
      <ThemeConfig dark={storage.get(storage.keys.isLight) === "true" ? false : true} />
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider autoHideDuration={3000} />
          <Routes>
            <Route path="/attendanceDeviceLogin" element={<AttendanceDeviceLogin />} />
            <Route path={ROUTES.APP.ATTENDANCE_DEVICE_QR} element={<AttendanceDeviceQR />} />
            <Route path="*" element={isLoggedIn ? <App /> : <Auth />} />
          </Routes>
        </PersistGate>
      </BrowserRouter>
    </>
  );
};

export default RootProviderHoc;
