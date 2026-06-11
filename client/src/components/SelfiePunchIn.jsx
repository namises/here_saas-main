import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { HiCamera, HiRefresh, HiCheckCircle } from "react-icons/hi";
import useMarkSelfieAttendance from "src/API/hooks/useMarkSelfieAttendance";
import { useSelector } from "react-redux";
import { useElapsedDuration } from "src/hooks/useElapsedDuration";
import { formatDurationinSec } from "src/utils";

const SelfiePunchIn = ({ onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [cameraError, setCameraError] = useState(null);

  const checkInTime = useSelector((s) => s.checkInTime);
  const shiftDuration = useElapsedDuration(checkInTime, 1000);

  const { handleMarkSelfieAttendance, loading } = useMarkSelfieAttendance(onClose);

  const startCamera = useCallback(async (mode) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCameraReady(false);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      setCameraError("Camera access denied. Please allow camera permission.");
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, startCamera]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCaptured(dataUrl);
  };

  const retake = () => setCaptured(null);

  const submit = () => {
    if (captured) handleMarkSelfieAttendance(captured);
  };

  const toggleCamera = () => {
    setCaptured(null);
    setFacingMode((m) => (m === "user" ? "environment" : "user"));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      {checkInTime ? (
        <p className="text-white font-bold text-center">Log in Hours - {formatDurationinSec(shiftDuration)}</p>
      ) : null}

      {cameraError ? (
        <div className="text-red-400 text-center p-4">{cameraError}</div>
      ) : (
        <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full rounded-xl ${captured ? "hidden" : "block"}`}
          />
          {captured && (
            <img src={captured} alt="captured selfie" className="w-full rounded-xl" />
          )}
          {!cameraReady && !captured && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
              <Spinner size="xl" />
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3 mt-2">
        {!captured ? (
          <>
            <Button color="blue" onClick={capturePhoto} disabled={!cameraReady || loading}>
              <HiCamera className="mr-2 text-lg" /> Capture
            </Button>
            <Button color="gray" onClick={toggleCamera} disabled={loading}>
              <HiRefresh className="mr-2 text-lg" /> Flip
            </Button>
          </>
        ) : (
          <>
            <Button color="green" onClick={submit} isProcessing={loading} disabled={loading}>
              <HiCheckCircle className="mr-2 text-lg" />
              {checkInTime ? "Punch Out" : "Punch In"}
            </Button>
            <Button color="gray" onClick={retake} disabled={loading}>
              <HiCamera className="mr-2 text-lg" /> Retake
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SelfiePunchIn;
