import { Schema, model } from "mongoose";

/**
 * Registry of physical biometric / face / fingerprint terminals.
 * Complements the existing QR / selfie attendance device login.
 */
const BiometricDeviceSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", default: null },
    name: { type: String, required: true },
    serialNumber: { type: String, required: true },
    deviceType: { type: String, enum: ["fingerprint", "face", "iris", "rfid", "hybrid"], default: "fingerprint" },
    vendor: { type: String, default: "ZKTeco" },
    ipAddress: String,
    location: String,
    firmware: String,
    enrolledUsers: { type: Number, default: 0 },
    lastSyncAt: { type: Number, default: null },
    status: { type: String, enum: ["online", "offline", "maintenance"], default: "offline" },
  },
  { timestamps: true }
);

export default model("BiometricDevice", BiometricDeviceSchema);
