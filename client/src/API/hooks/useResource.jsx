import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, resourceListUrl } from "../api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

/**
 * Generic org-scoped resource hook for all new modules.
 * @param {object} cfg
 * @param {string} cfg.name      backend resource segment, e.g. "asset"
 * @param {string} cfg.listKey   key returned in the list payload, e.g. "assets"
 * @param {object} [cfg.initialFilters]
 * @param {number} [cfg.limit]
 */
const useResource = ({ name, listKey, initialFilters = {}, limit = 100 }) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [submitting, setSubmitting] = useState(false);
  const loading = useSelector((s) => s.apiStatus[resourceListUrl(name)]);
  const api = API[name];

  const fetchList = async (override = {}) => {
    const res = await api.list({ page, limit, ...filters, ...override });
    const payload = res?.data?.[listKey];
    if (payload) {
      setItems(payload.items || []);
      setPagination(payload.pagination || null);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, JSON.stringify(filters)]);

  const create = async (body) => {
    setSubmitting(true);
    const res = await api.create(body);
    setSubmitting(false);
    if (res?.success) {
      dispatchSnackbar(res.data?.message || "Created successfully", snackBarTypes.success);
      await fetchList();
      return true;
    }
    return false;
  };

  const update = async (body) => {
    setSubmitting(true);
    const res = await api.update(body);
    setSubmitting(false);
    if (res?.success) {
      dispatchSnackbar(res.data?.message || "Updated successfully", snackBarTypes.success);
      await fetchList();
      return true;
    }
    return false;
  };

  const remove = async (id) => {
    const res = await api.remove({ id });
    if (res?.success) {
      dispatchSnackbar(res.data?.message || "Deleted", snackBarTypes.success);
      await fetchList();
      return true;
    }
    return false;
  };

  return { items, pagination, page, setPage, filters, setFilters, loading, submitting, refetch: fetchList, create, update, remove, api };
};

export default useResource;
