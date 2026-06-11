import React from "react";
import { Badge, Card } from "flowbite-react";
import { formatTimestampToHumandateTime } from "src/utils";
import { MdEdit } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { useSelector } from "react-redux";

const LocationLink = ({ lat, lng, label }) => {
  if (!lat || !lng) return null;
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline text-xs mt-1">
      <HiLocationMarker className="shrink-0" /> {label}
    </a>
  );
};

const AttendanceCardView = ({ attendance, loading, setRequesting }) => {
  const { employee } = useSelector((state) => state.user);

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      {loading
        ? [1, 2, 3, 4].map((v) => <Card key={v} className="animate-pulse w-sm" />)
        : attendance && attendance.length
        ? attendance.map((item) => (
            <Card key={item._id} className="w-full">
              <div className="flex justify-start items-start gap-4">
                {item?.selfie?.checkIn && (
                  <a href={item.selfie.checkIn} target="_blank" rel="noopener noreferrer">
                    <img
                      src={item.selfie.checkIn}
                      alt="punch-in selfie"
                      className="w-14 h-14 rounded-full object-cover border-2 border-blue-400 shrink-0"
                    />
                  </a>
                )}
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">{item?.employee?.name}</h5>
                    <div className="flex gap-4 items-center justify-center">
                      <Badge color="success" className="capitalize flex justify-center items-center">
                        {item?.status}
                      </Badge>
                      {item?.employee?._id === employee ? (
                        <MdEdit className="cursor-pointer text-xl text-white" onClick={() => setRequesting({ ...item })} />
                      ) : null}
                    </div>
                  </div>
                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mb-1">{item?.employee?.empCode}</p>
                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400">
                    {item?.checkIn ? `In : ${formatTimestampToHumandateTime(item?.checkIn)}` : "In : Not Available"}
                  </p>
                  <LocationLink lat={item?.location?.lat} lng={item?.location?.lng} label="Check-In Location" />
                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400 mt-1">
                    {item?.checkOut ? `Out : ${formatTimestampToHumandateTime(item?.checkOut)}` : "Out : Not Available"}
                  </p>
                  {item?.selfie?.checkOut && (
                    <a href={item.selfie.checkOut} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                      View check-out selfie
                    </a>
                  )}
                  <LocationLink lat={item?.checkOutLocation?.lat} lng={item?.checkOutLocation?.lng} label="Check-Out Location" />
                  <div className="flex gap-4 justify-start items-center font-normal text-sm text-gray-700 dark:text-gray-400 mt-1">
                    Requested{" "}
                    {item?.requested ? (
                      <Badge className="capitalize flex justify-center" color="success">
                        {item?.attendanceRequest?.status}
                      </Badge>
                    ) : (
                      "No"
                    )}
                  </div>
                  <p className="font-normal text-sm text-gray-700 dark:text-gray-400">{item?.attendanceRequest?.comments}</p>
                </div>
              </div>
            </Card>
          ))
        : null}
    </div>
  );
};

export default AttendanceCardView;
