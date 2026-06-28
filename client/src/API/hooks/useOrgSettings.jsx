import { useEffect, useState } from "react";
import { API } from "../api";

const useOrgSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.organization.getSettings().then((res) => {
      if (res?.success) setSettings(res.data.settings);
    }).finally(() => setLoading(false));
  }, []);

  return { settings, loading };
};

export default useOrgSettings;
