import { useEffect, useState } from "react";

export const useElapsedDuration = (fromTimestampSec, refreshIntervalMs = 1000) => {
  const [duration, setDuration] = useState(() => Math.floor(Date.now() / 1000) - fromTimestampSec);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowSec = Math.floor(Date.now() / 1000);
      setDuration(nowSec - fromTimestampSec);
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [fromTimestampSec, refreshIntervalMs]);

  return duration;
};
