import { Schema, model } from "mongoose";

const WpsRecordSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    employeeName: String,
    labourCardNumber: String,
    routingCode: String,
    iban: String,
    basicSalary: { type: Number, default: 0 },
    variablePay: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    daysOnLeave: { type: Number, default: 0 },
  },
  { _id: false }
);

/**
 * WPS (Wage Protection System) batch for UAE MOHRE salary submission.
 * Generates a Salary Information File (SIF) for the bank / WPS agent.
 */
const WpsBatchSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    month: { type: String, required: true }, // YYYY-MM
    employerId: String, // MOHRE establishment id
    bankRoutingCode: String,
    totalRecords: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: "AED" },
    records: { type: [WpsRecordSchema], default: [] },
    status: { type: String, enum: ["draft", "generated", "submitted", "accepted", "rejected"], default: "draft" },
    sifFileName: String,
    generatedBy: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
  },
  { timestamps: true }
);

export default model("WpsBatch", WpsBatchSchema);
