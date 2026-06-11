import React, { useEffect, useState } from "react";
import { storage } from "src/utils/storage";
import { TOTP } from "totp-generator";
import { QRCodeSVG } from "qrcode.react";

const AttendanceDeviceQR = () => {
  const [secret, setSecret] = useState(null);
  const [logo, setLogo] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [remaining, setRemaining] = useState(30);

  const loadSecretFromStorage = async () => {
    const { secret, name, logo } = await storage.get(storage.keys.here_id_key);
    if (secret) setSecret(secret);
    if (logo) setLogo(logo);
    if (name) setName(name);
  };

  useEffect(() => {
    if (!secret) return;
    const tick = () => {
      const now = Date.now();
      const secondsElapsed = Math.floor(now / 1000);
      const secondsRemaining = 30 - (secondsElapsed % 30);
      setRemaining(secondsRemaining);
      if (secondsRemaining === 30) {
        const newToken = TOTP.generate(secret);
        setToken(newToken.otp);
      }
      const percentage = (secondsRemaining / 30) * 100;
      const progress = document.querySelector(".progress path");
      const borderLen = progress.getTotalLength() + 5;
      progress.style.strokeDasharray = borderLen + "," + borderLen;
      const offsetToSet = (percentage / 100) * borderLen;
      progress.style.strokeDashoffset = borderLen - offsetToSet;
    };

    // Generate token immediately if we're at the start of the cycle
    tick();
    const interval = setInterval(tick, 1000); // run every second
    return () => clearInterval(interval);
  }, [secret]);

  useEffect(() => {
    loadSecretFromStorage();
  }, []);

  return (
    <div className="flex justify-center pt-50 h-[100svh]">
      {secret ? (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">{name}</h2>
          {logo ? <img className="w-[150px] rounded-full shadow-2xl" src={logo} /> : null}
          <h2 className="text-md font-semibold">Scan For Attendance</h2>
          {/* <h1 className="text-4xl font-mono">{token}</h1> */}
          <p className="text-gray-600 text-sm font-bold">Expires in: {remaining}s</p>

          <div className="relative  flex justify-center items-center">
            <div className="progress">
              <svg viewBox="0 0 210 210" preserveAspectRatio="none">
                <path
                  d="M15,5 H195 A10,10 0 0 1 205,15 V195 A10,10 0 0 1 195,205 H15 A10,10 0 0 1 5,195 V15 A10,10 0 0 1 15,5 Z"
                  fill="none"
                  stroke="#10b981" // Tailwind emerald-500
                  strokeWidth="4"
                  style={{
                    transition: "stroke-dashoffset 1s linear",
                  }}
                />
              </svg>
            </div>
            <div className="absolute">
              <QRCodeSVG value={token || "waiting"} size={180} />
            </div>
          </div>
        </div>
      ) : (
        // <>
        //   <h2>Current TOTP Code:</h2>
        //   <h1>{token}</h1>
        //   <p>Expires in: {remaining}s</p>
        // </>
        <p className="text-xl font-bold text-red-400 border border-red-400 rounded px-5 py-3">Not Logged in</p>
      )}
    </div>
  );
};

export default AttendanceDeviceQR;
