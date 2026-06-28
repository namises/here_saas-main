import React, { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { HiOutlineQrCode } from "react-icons/hi2";
import { HiCamera } from "react-icons/hi";
import { Drawer, DrawerHeader, DrawerItems, TabItem, Tabs } from "flowbite-react";
import useMarkAttendance from "src/API/hooks/useMarkAttendance";
import useOrgSettings from "src/API/hooks/useOrgSettings";
import { useSelector } from "react-redux";
import { useElapsedDuration } from "src/hooks/useElapsedDuration";
import { formatDurationinSec } from "src/utils";
import { resolvePunchType } from "src/utils/roles";
import SelfiePunchIn from "./SelfiePunchIn";

const MarkAttendance = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState(null);
  const handleClose = () => setIsOpen(false);
  const checkInTime = useSelector((s) => s.checkInTime);
  const user = useSelector((s) => s.user);
  const shiftDuration = useElapsedDuration(checkInTime, 1000);
  const { settings } = useOrgSettings();

  const { handleMarkAttendance, loading } = useMarkAttendance(handleClose);

  // Per-employee method (manager-set) wins; otherwise fall back to the org-wide setting.
  const punchType = resolvePunchType(user, settings?.attendancePunchType);
  const showQR = punchType === "qr" || punchType === "both";
  const showSelfie = punchType === "selfie" || punchType === "both";

  useEffect(() => {
    setResult(null);
  }, [isOpen]);

  useEffect(() => {
    if (result?.[0]?.rawValue) {
      handleMarkAttendance(result?.[0]?.rawValue);
    }
  }, [result]);

  const icon = showSelfie && !showQR ? (
    <HiCamera className="text-[2rem] text-white cursor-pointer" onClick={() => setIsOpen(true)} />
  ) : (
    <HiOutlineQrCode className="text-[2rem] text-white cursor-pointer" onClick={() => setIsOpen(true)} />
  );

  return (
    <>
      {icon}
      <Drawer className="w-full max-w-[700px] z-100" open={isOpen} onClose={handleClose}>
        <DrawerHeader title="Mark Attendance" titleIcon={() => null} />
        <DrawerItems>
          <h6 className="text-center text-white font-bold mb-4">
            {checkInTime ? `Log in Hours - ${formatDurationinSec(shiftDuration)}` : ""}
          </h6>

          {punchType === "both" ? (
            <Tabs>
              <TabItem title="QR Code" icon={HiOutlineQrCode}>
                <div className="py-2">
                  {loading ? (
                    <div className="animate-pulse bg-white rounded p-4 h-32" />
                  ) : isOpen ? (
                    <Scanner onScan={setResult} />
                  ) : null}
                </div>
              </TabItem>
              <TabItem title="Selfie" icon={HiCamera}>
                <div className="py-2">
                  {isOpen ? <SelfiePunchIn onClose={handleClose} /> : null}
                </div>
              </TabItem>
            </Tabs>
          ) : showQR ? (
            loading ? <div className="animate-pulse bg-white rounded p-4 h-32" /> : isOpen ? <Scanner onScan={setResult} /> : null
          ) : (
            isOpen ? <SelfiePunchIn onClose={handleClose} /> : null
          )}
        </DrawerItems>
      </Drawer>
    </>
  );
};

export default MarkAttendance;
