import { Schema, model } from "mongoose";

const ShiftSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    name: { type: String, required: true }, // e.g. "Night Shift"
    startTime: { type: String, required: true }, // Format: "21:00" (9 PM)
    endTime: { type: String, required: true }, // Format: "05:00" (5 AM)
    isOvernight: { type: Boolean, required: true }, // true if endTime < startTime
    gracePeriodMins: { type: Number, default: 0 }, // optional, e.g. 15 mins
    minHalfDayDuration: { type: Number, default: 0 }, // optional, e.g. 15 mins
    minFullDayDuration: { type: Number, default: 0 }, // optional, e.g. 15 mins
  },
  { timestamps: true }
);

const Shift = model("Shift", ShiftSchema);
export default Shift;
