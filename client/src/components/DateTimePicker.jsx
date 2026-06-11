import { Datepicker, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

export default function DateTimePicker({ value, setter, label, error, required, disabled }) {
  const [valueProcessed, setValueProcessed] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("00:00");
  useEffect(() => {
    if (date && time) {
      const newDate = date.setHours(Number(time.split(":")[0]), Number(time.split(":")[1]));
      if (setter && typeof setter === "function") {
        setter(Math.floor(newDate / 1000));
      }
    }
  }, [date, time]);
  useEffect(() => {
    console.log({ value, valueProcessed });
    if (value && !valueProcessed) {
      console.log({ value, valueProcessed });
      setDate(new Date(value * 1000));
      setTime(`${`${new Date(value * 1000).getHours()}`.padStart(2, 0)}:${`${new Date(value * 1000).getMinutes()}`.padStart(2, 0)}`);
      setValueProcessed(true);
    }
  }, [value, valueProcessed]);

  return (
    <div className="mb-2 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm m-0 text-gray-400">{required ? `${label}*` : label}</span>
        <span className="ml-1 text-xs mb-0 text-red-400">{error}&nbsp;</span>
      </div>
      <div className="flex flex-row gap-2">
        <Datepicker disabled={disabled} onChange={setDate} value={date} className="w-full" icon={false} />
        <TextInput disabled={disabled} type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex-1/4" />
      </div>
    </div>
  );
}
