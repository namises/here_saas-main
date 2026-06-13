import { useEffect, useState } from "react";
import { API } from "../api";

/** Employees as { value, label } options for select fields. */
export const useEmployeeOptions = () => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      const res = await API.employee.list({ page: 1, limit: 200 });
      const items = res?.data?.employees?.items || [];
      if (active) setOptions(items.map((e) => ({ value: e._id, label: e.name })));
    })();
    return () => {
      active = false;
    };
  }, []);
  return options;
};

/** Generic resource options loader, e.g. useResourceOptions("branch", "branches"). */
export const useResourceOptions = (name, listKey, labelKey = "name") => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      const res = await API[name]?.list({ page: 1, limit: 200 });
      const items = res?.data?.[listKey]?.items || [];
      if (active) setOptions(items.map((e) => ({ value: e._id, label: e[labelKey] || e.title || e.name })));
    })();
    return () => {
      active = false;
    };
  }, [name, listKey, labelKey]);
  return options;
};
