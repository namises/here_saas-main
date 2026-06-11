import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { API, endpoints } from "../api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const useFileUpload = (onUploadSuccess) => {
  const loading = useSelector((s) => s.apiStatus[endpoints.media.upload]);

  const handleUploadFile = async (files) => {
    const res = await API.media.upload(files);
    if (res.success) {
      dispatchSnackbar("File Uploaded Successfully", snackBarTypes.success);
      onUploadSuccess(res.data.url);
    }
  };

  return { handleUploadFile, loading };
};

export default useFileUpload;
