import { Schema, model } from "mongoose";

const PayrollComponentSchema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    inHandComponent: { type: Boolean, default: false },
    type: { type: String, enum: ["earnings", "deductions"], required: true },
  },
  { _id: false }
);

const PayrollSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    month: { type: String, required: true, enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
    status: { type: String, enum: ["pending", "processed"], default: "pending" },
    totalWorkingDays: { type: Number, required: true },
    presentDays: { type: Number, required: true },
    grossSalary: { type: Number, required: true }, // auto-calculated
    netSalary: { type: Number, required: true }, // auto-calculated
    remarks: String,
    financialYear: { type: String, required: true }, // e.g., "2025-26"
    components: [PayrollComponentSchema],
  },
  { timestamps: true }
);

const Payroll = model("Payroll", PayrollSchema);

export default Payroll;
