import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { LuCamera, LuUpload, LuCheck, LuX } from "react-icons/lu";
import useFileUpload from "src/API/hooks/useFIleUpload";

// Profile image picker with two sources: device file (any image format) or live camera capture.
// On a successful upload it calls onChange(url) with the hosted media URL.
const ProfileImageUpload = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const { handleUploadFile, loading } = useFileUpload((url) => onChange(url));

  const upload = (files) => {
    if (files && files.length) handleUploadFile(files);
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch {
      setCameraError("Camera access denied. Allow camera permission and try again.");
    }
  }, []);

  useEffect(() => {
    if (cameraOpen) startCamera();
    else stopCamera();
    return stopCamera;
  }, [cameraOpen, startCamera, stopCamera]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `profile-${Date.now()}.jpg`, { type: "image/jpeg" });
        const dt = new DataTransfer();
        dt.items.add(file);
        upload(dt.files);
        setCameraOpen(false);
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {cameraOpen ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-xl bg-black">
          {cameraError ? (
            <div className="p-6 text-center text-sm text-red-400">{cameraError}</div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-xl" />
              {!cameraReady ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Spinner size="xl" />
                </div>
              ) : null}
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <img
          className="h-24 w-24 rounded-2xl object-cover ring-2 ring-blue-100 dark:ring-blue-900"
          src={value || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
          alt="profile"
        />
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-wrap items-center justify-center gap-2">
        {cameraOpen ? (
          <>
            <Button color="blue" size="sm" onClick={capture} disabled={!cameraReady || loading} isProcessing={loading}>
              <LuCheck className="mr-1.5" /> Capture
            </Button>
            <Button color="gray" size="sm" onClick={() => setCameraOpen(false)} disabled={loading}>
              <LuX className="mr-1.5" /> Cancel
            </Button>
          </>
        ) : (
          <>
            <Button color="gray" size="sm" onClick={() => fileInputRef.current?.click()} disabled={loading} isProcessing={loading}>
              <LuUpload className="mr-1.5" /> Upload
            </Button>
            <Button color="gray" size="sm" onClick={() => setCameraOpen(true)} disabled={loading}>
              <LuCamera className="mr-1.5" /> Camera
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUpload;
