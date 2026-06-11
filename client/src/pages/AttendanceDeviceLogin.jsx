import React, { useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import useLoginDevice from "src/API/hooks/useLoginDevice";

const AttendanceDeviceLogin = () => {
  const [searchParams] = useSearchParams();
  const login = searchParams.get("login");
  const pass = searchParams.get("pass");
  const organization = searchParams.get("org");
  const id = searchParams.get("id");

  const { handleLoginDevice, error, loading } = useLoginDevice(login, pass, organization, id);

  useEffect(() => {
    if (login && pass && organization && id) {
      handleLoginDevice();
    }
  }, [login, pass, organization, id]);

  return <div>{loading ? <p>loading...</p> : error?.login || error?.pass || error?.org || error?.id}</div>;
};

export default AttendanceDeviceLogin;
