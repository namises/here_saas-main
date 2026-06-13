import { Schema, model } from "mongoose";

/**
 * UAE compliance documents tracking — Emirates ID, residence visa,
 * labour card, passport, work permit, etc. Powers expiry alerts.
 */
const ComplianceRecordSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    documentType: {
      type: String,
      enum: ["emirates-id", "residence-visa", "labour-card", "passport", "work-permit", "health-insurance", "labour-contract"],
      required: true,
    },
    documentNumber: { type: String, required: true },
    issuingEmirate: { type: String, default: "Dubai" },
    issueDate: { type: Number, default: null }, // unix seconds
    expiryDate: { type: Number, required: true },
    fileUrl: String,
    status: { type: String, enum: ["valid", "expiring-soon", "expired", "under-renewal"], default: "valid" },
    notes: String,
  },
  { timestamps: true }
);

export default model("ComplianceRecord", ComplianceRecordSchema);
