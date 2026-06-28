import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Label, TextInput, ToggleSwitch } from "flowbite-react";
import { LuAlarmClock, LuTrash2, LuPlus, LuBellRing } from "react-icons/lu";
import { dispatchSnackbar, snackBarTypes } from "src/utils/snackbar";

// NOTE: Alarms are in-app punch-in/out reminders stored locally and fired while the
// app is open (Notification API + 1-min tick). Background push via FCM is a future
// enhancement — see HANDOFF.md Phase 5.
const keyFor = (id) => `alarms:${id || "anon"}`;

const Alarm = () => {
  const user = useSelector((s) => s.user);
  const storageKey = useMemo(() => keyFor(user?._id), [user?._id]);
  const [alarms, setAlarms] = useState([]);
  const [time, setTime] = useState("09:00");
  const [label, setLabel] = useState("Punch in reminder");
  const firedRef = useRef({}); // de-dupe per minute

  useEffect(() => {
    try {
      setAlarms(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    } catch {
      setAlarms([]);
    }
  }, [storageKey]);

  const persist = (next) => {
    setAlarms(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const res = await Notification.requestPermission();
    return res === "granted";
  };

  const add = async () => {
    if (!time) return;
    await requestPermission();
    persist([...alarms, { id: Date.now(), time, label: label.trim() || "Reminder", enabled: true }]);
    setLabel("Punch in reminder");
  };

  const toggle = (id) => persist(alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  const remove = (id) => persist(alarms.filter((a) => a.id !== id));

  // Tick every 20s; when current HH:MM matches an enabled alarm, fire once for that minute.
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      alarms.forEach((a) => {
        if (!a.enabled || a.time !== hhmm) return;
        const fireKey = `${a.id}-${now.toDateString()}-${hhmm}`;
        if (firedRef.current[fireKey]) return;
        firedRef.current[fireKey] = true;
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("⏰ " + a.label, { body: "Time to mark your attendance." });
        } else {
          dispatchSnackbar(`⏰ ${a.label}`, snackBarTypes.success);
        }
      });
    };
    const interval = setInterval(tick, 20000);
    return () => clearInterval(interval);
  }, [alarms]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Set Alarm</h1>
        <p className="text-sm text-gray-400">Reminders to punch in / out. Active while the app is open.</p>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="time">Time</Label>
            <TextInput id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1" />
          </div>
          <div className="flex-1 min-w-[180px]">
            <Label htmlFor="label">Label</Label>
            <TextInput id="label" value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1" />
          </div>
          <Button color="blue" onClick={add}>
            <LuPlus className="mr-2" /> Add
          </Button>
        </div>
      </div>

      {alarms.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-10 text-gray-300 dark:bg-gray-800">
          <LuAlarmClock size="2rem" />
          <p className="text-sm">No alarms set.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alarms.map((a) => (
            <div key={a.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.enabled ? "bg-violet-50 text-violet-500 dark:bg-violet-900/30" : "bg-gray-100 text-gray-400 dark:bg-gray-700"}`}>
                <LuBellRing size="1.3rem" />
              </span>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{a.time}</p>
                <p className="text-xs text-gray-400">{a.label}</p>
              </div>
              <ToggleSwitch checked={a.enabled} onChange={() => toggle(a.id)} />
              <button onClick={() => remove(a.id)} className="text-gray-300 transition hover:text-rose-500" aria-label="Delete alarm">
                <LuTrash2 size="1.1rem" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alarm;
