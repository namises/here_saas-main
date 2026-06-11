import React from "react";
import { FILE_URL_REGEX } from "src/API/validations/validators";

const CustomDocViewer = ({ fileUrl, name }) => {
  console.log({ fileUrl });
  const match = fileUrl.match(FILE_URL_REGEX);

  console.log({ match });
  if (!match) return "Invalid file URL";

  const extension = match[1].toLowerCase();
  const isImage = ["webp", "png", "jpg", "jpeg"].includes(extension);
  const isDocument = ["pdf", "doc", "docx"].includes(extension);
  return (
    <div className="h-full">
      <p className="text-gray-800 px-10 font-bold text-md">{name}</p>
      <div className="flex h-full justify-center items-center p-10">{isImage ? <img src={fileUrl} alt="Image Preview" className=" h-[90%] object-contain" /> : isDocument ? <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`} style={{ width: "100%", height: "100%", border: "none" }} title="Document Preview" /> : <p>Unsupported file type</p>}</div>
    </div>
  );
};

export default CustomDocViewer;
