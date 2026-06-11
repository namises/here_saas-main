import React from "react";
import useAttendanceDevice from "src/API/hooks/useAttendanceDevice";
import { QRCodeSVG } from "qrcode.react";
import { Spinner } from "flowbite-react";
const AttendanceDevices = () => {
  const { url } = useAttendanceDevice();
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="flex flex-col items-center w-100 justify-center p-10 border-2 rounded-md gap-5">
        <p className="text-center break-words font-bold text-gray-600">Scan this QR code to setup a device for employees to scan and mark attendance</p>
        <p className="text-center break-words font-bold text-red-600">Make sure this qr is kept secret</p>
        <a className="break-all" href={url} target="_blank">
          {url}
        </a>
        {url ? <QRCodeSVG value={url} size={300} /> : <Spinner />}
      </div>
    </div>
  );
};

export default AttendanceDevices;
