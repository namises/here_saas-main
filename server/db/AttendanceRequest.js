import { Schema, model } from "mongoose";

const AttendanceRequestSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    attendance: { type: Schema.Types.ObjectId, ref: "Attendance", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    checkIn: { type: Number, required: true },
    checkOut: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    comments: { type: String, default: "" },
  },
  { timestamps: true }
);

const AttendanceRequest = model("AttendanceRequest", AttendanceRequestSchema);

export default AttendanceRequest;
