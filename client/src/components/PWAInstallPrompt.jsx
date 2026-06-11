import { Button } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa";

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
      setExpanded(true);

      // Auto-collapse after 5 seconds
      timeoutRef.current = setTimeout(() => setExpanded(false), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response:", outcome);
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div onClick={handleInstall} className={`flex items-center bg-white text-gray-800 text-xs font-medium transition-all duration-500 ease-in-out hover:bg-blue-700 h-[32px] rounded-md ${expanded ? "w-[96px] px-4 pr-4" : "w-0 overflow-hidden"}`}>
      {expanded ? `Install App` : ``}
    </div>
  );
};

export default PWAInstallButton;
