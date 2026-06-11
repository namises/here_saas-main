import { Badge, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Tooltip } from "flowbite-react";
import { MdEdit } from "react-icons/md";
import { HiLocationMarker, HiPhotograph } from "react-icons/hi";
import { useSelector } from "react-redux";
import { formatTimestampToHumandateTime } from "src/utils";

const LocationLink = ({ lat, lng, label }) => {
  if (!lat || !lng) return <span className="text-gray-400 text-xs">—</span>;
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline text-xs">
      <HiLocationMarker className="shrink-0" />
      {label}
    </a>
  );
};

const SelfieThumb = ({ url }) => {
  if (!url) return <span className="text-gray-400 text-xs">—</span>;
  return (
    <Tooltip content={<img src={url} alt="selfie" className="w-48 h-48 object-cover rounded" />}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img src={url} alt="selfie" className="w-8 h-8 rounded-full object-cover border border-gray-300 cursor-pointer" />
      </a>
    </Tooltip>
  );
};

const AttendanceTableView = ({ attendance, loading, setRequesting }) => {
  const { employee } = useSelector((state) => state.user);

  const skeletonCell = <TableCell><div className="w-[90%] animate-pulse bg-white rounded-full p-2" /></TableCell>;

  return (
    <div className="overflow-x-auto mt-5 rounded-md">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Code</TableHeadCell>
            <TableHeadCell>CheckIn</TableHeadCell>
            <TableHeadCell>CheckOut</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Selfie</TableHeadCell>
            <TableHeadCell>Check-In Location</TableHeadCell>
            <TableHeadCell>Check-Out Location</TableHeadCell>
            <TableHeadCell>Requested</TableHeadCell>
            <TableHeadCell>Comments</TableHeadCell>
            <TableHeadCell><span className="sr-only">Edit</span></TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {loading
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((v) => (
                <TableRow key={v} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  {[...Array(11)].map((_, i) => (
                    <TableCell key={i}><div className="w-[90%] animate-pulse bg-white rounded-full p-2" /></TableCell>
                  ))}
                </TableRow>
              ))
            : attendance && attendance.length
            ? attendance.map((item) => (
                <TableRow key={item._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.employee?.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.employee?.empCode}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item?.checkIn ? formatTimestampToHumandateTime(item?.checkIn) : "Not Available"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item?.checkOut ? formatTimestampToHumandateTime(item?.checkOut) : "Not Available"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    <Badge className="capitalize flex justify-center" color="success">{item?.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <SelfieThumb url={item?.selfie?.checkIn} />
                      {item?.selfie?.checkOut && <SelfieThumb url={item?.selfie?.checkOut} />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <LocationLink lat={item?.location?.lat} lng={item?.location?.lng} label="In" />
                  </TableCell>
                  <TableCell>
                    <LocationLink lat={item?.checkOutLocation?.lat} lng={item?.checkOutLocation?.lng} label="Out" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item?.requested ? (
                      <Badge className="capitalize flex justify-center" color="success">{item?.attendanceRequest?.status}</Badge>
                    ) : "No"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{item?.comments}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item?.employee?._id === employee ? (
                      <MdEdit className="cursor-pointer text-xl text-white" onClick={() => setRequesting({ ...item })} />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTableView;
