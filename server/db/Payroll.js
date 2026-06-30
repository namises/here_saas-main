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
    totalDaysInMonth: { type: Number, default: 0 }, // calendar days in the month
    totalWorkingDays: { type: Number, required: true }, // days the employee was expected to work (excl. week-offs/holidays)
    presentDays: { type: Number, required: true },
    // Attendance breakdown for the period
    absentDays: { type: Number, default: 0 },
    halfDays: { type: Number, default: 0 },
    leaveDays: { type: Number, default: 0 },
    holidayDays: { type: Number, default: 0 },
    weekOffDays: { type: Number, default: 0 },
    payableDays: { type: Number, default: 0 }, // present + half*0.5 + leave + holiday + weekoff
    grossSalary: { type: Number, required: true }, // auto-calculated (prorated earnings)
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true }, // gross - deductions
    remarks: String,
    financialYear: { type: String, required: true }, // e.g., "2025-26"
    components: [PayrollComponentSchema],
  },
  { timestamps: true }
);

const Payroll = model("Payroll", PayrollSchema);

export default Payroll;
