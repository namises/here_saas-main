import React from "react";
import { useSelector } from "react-redux";

const useIsLoggedIn = () => {
  const user = useSelector((state) => state.user);
  const isLoggedIn = Boolean(user?.token);
  return {
    user,
    isLoggedIn,
  };
};

export default useIsLoggedIn;
