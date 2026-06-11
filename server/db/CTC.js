import { Schema, model } from "mongoose";

const EarningsSchema = new Schema(
  {
    name: { type: String, required: true },
    annualAmount: { type: Number, required: true },
    type: { type: String, default: "earnings" },
    inHandComponent: { type: Boolean, default: true },
  },
  { _id: false }
);
const DeductionsSchema = new Schema(
  {
    name: { type: String, required: true },
    annualAmount: { type: Number, required: true },
    type: { type: String, default: "deductions" },
    inHandComponent: { type: Boolean, default: true },
  },
  { _id: false }
);

const CTCSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    financialYear: { type: String, required: true }, // e.g., "2025-26"
    totalCTC: { type: Number }, // auto-calculated
    earnings: [EarningsSchema],
    deductions: [DeductionsSchema],
    effectiveFrom: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    effectiveTill: { type: Number, default: null },
    remarks: String,
  },
  { timestamps: true }
);

const CTC = model("CTC", CTCSchema);
export default CTC;
