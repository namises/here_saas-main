import { Spinner } from "flowbite-react";
import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { API } from "src/API/api";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

const FileUpload = ({ id, setter, name, setname, type, settype }) => {
  const [loading, setLoading] = useState(false);

  const handleUploadFile = async (files) => {
    setLoading(true);
    const file = files[0];
    setname(file?.name);
    const res = await API.media.upload(files);
    setLoading(false);
    if (res.success) {
      dispatchSnackbar("File Uploaded Successfully", snackBarTypes.success);
      setter(res.data.url);
    }
  };

  return (
    <div className="relative aspect-square w-full border border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer group">
      <div className="absolute flex gap-x-2 bottom-2 right-2 z-30">
        <MdDelete className="text-red-600 text-2xl cursor-pointer bg-white rounded-full p-1 shadow-md border" onClick={() => setter("delete")} />
        <label htmlFor={`file-upload-${id}`} className="cursor-pointer">
          <MdEdit className="text-gray-600 text-2xl bg-white rounded-full p-1 shadow-md border" />
        </label>
      </div>
      <input id={`file-upload-${id}`} type="file" name="file" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" onChange={(e) => handleUploadFile(e.target.files)} className="hidden" />
      {loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-center text-xs break-all font-semibold text-gray-500 bg-gray-100 capitalize">{name || `Upload`}</div>
      )}
    </div>
  );
};

export default FileUpload;
