import { Schema, model } from "mongoose";

const AttendanceCodeSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    deviceId: { type: String, required: true },
    secret: { type: String, required: true },
    loginPassword: { type: String, required: true },
  },
  { timestamps: true }
);

const AttendanceCode = model("AttendanceCode", AttendanceCodeSchema);

export default AttendanceCode;
