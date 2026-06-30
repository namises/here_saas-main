import axios from "axios";
import curlirize from "axios-curlirize";
import store, { clearReducer } from "src/redux";
import { updateAPIStatus } from "src/redux/reducers/apiStatus";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";
import { storage } from "src/utils/storage";

// console.log({ axios });

curlirize(axios);

export async function getipInfo() {
  const ipData = await storage.get(storage.keys.locale);
  return ipData;
}

const dispatch = store.dispatch;

const setLoadingTrue = (url) => {
  if (dispatch && typeof dispatch === "function") {
    dispatch(updateAPIStatus({ url, loading: true }));
  }
};

const setLoadingFalse = (url) => {
  if (dispatch && typeof dispatch === "function") {
    dispatch(updateAPIStatus({ url, loading: false }));
  }
};

const getURLInitials = (url) => {
  if (url.includes("?")) {
    return url.slice(0, url.indexOf("?"));
  } else {
    return url;
  }
};

const getHeaders = async (t, mediaUpload) => {
  let ipdata = await getipInfo();
  let headers = { "Content-Type": mediaUpload ? "multipart/form-data" : "application/json", "x-locale": ipdata?.languages && ipdata?.languages.length ? ipdata.languages.split(",")[0] : "en-IN" };
  return t ? { headers: { ...headers, Authorization: `Bearer ${t}` } } : { ...headers };
};

const handleResponse = (method, initials, response, requestBody, url, isBlob) => {
  setLoadingFalse(initials);
  if (isBlob) return response.data;
  if (response.data.success) {
    return response.data;
  } else {
    handleError(method, initials, { response }, requestBody, url);
    return null;
  }
};

const handleError = (method, initials, error, requestBody, url) => {
  setLoadingFalse(initials);
  if (`${error?.response?.data?.message}` === "Invalid Token") {
    dispatchSnackbar("Session expired please login again.", snackBarTypes.error);
    dispatch(clearReducer());
    localStorage.clear();
    window.location.replace("/");
  } else {
    dispatchSnackbar(error?.response?.data?.message || error?.response?.data?.message || "Server error please try later.", snackBarTypes.error);
  }
};

export const get = async (url, isBlob) => {
  let initials = getURLInitials(url);
  try {
    setLoadingTrue(initials);
    const t = await storage.get(storage.keys.token);
    const headers = await getHeaders(t, false, isBlob);
    const config = isBlob ? { ...headers, responseType: "blob" } : headers;
    const response = await axios.get(url, config);
    return handleResponse("get", initials, response, {}, url, isBlob);
  } catch (error) {
    handleError("get", initials, error, {}, url);
  }
};

export const post = async (url, requestBody) => {
  let initials = getURLInitials(url);
  try {
    const t = await storage.get(storage.keys.token);
    setLoadingTrue(initials);
    const headers = await getHeaders(t);
    const response = await axios.post(url, requestBody, headers);
    return handleResponse("post", initials, response, requestBody, url);
  } catch (error) {
    handleError("post", initials, error, requestBody, url);
  }
};

export const postMultipart = async (url, requestBody) => {
  let initials = getURLInitials(url);
  try {
    const t = await storage.get(storage.keys.token);
    setLoadingTrue(initials);
    const ipdata = await getipInfo();
    const formData = new FormData();
    // requestBody is a FileList / File[] from an <input type="file">. The server reads req.files["files[]"].
    const list = requestBody instanceof FileList ? Array.from(requestBody) : Array.isArray(requestBody) ? requestBody : null;
    if (list) {
      list.forEach((file) => formData.append("files[]", file));
    } else {
      Object.keys(requestBody || {}).forEach((k) => {
        if (requestBody[k]) formData.append(k, requestBody[k]);
      });
    }
    // Do NOT set Content-Type manually — the browser must add the multipart boundary itself.
    const headers = { "x-locale": ipdata?.languages?.length ? ipdata.languages.split(",")[0] : "en-IN", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
    const response = await axios.post(url, formData, { headers });
    return handleResponse("post", initials, response, requestBody, url);
  } catch (error) {
    handleError("post", initials, error, requestBody, url);
  }
};
