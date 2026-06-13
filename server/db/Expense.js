import { Schema, model } from "mongoose";

const ExpenseSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ["travel", "food", "accommodation", "supplies", "software", "training", "other"], default: "travel" },
    amount: { type: Number, required: true },
    currency: { type: String, default: "AED" },
    date: { type: Number, required: true }, // unix seconds
    description: String,
    receiptUrl: String,
    status: { type: String, enum: ["pending", "approved", "rejected", "reimbursed"], default: "pending" },
    approver: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    actionComments: String,
    actionedAt: { type: Number, default: null },
  },
  { timestamps: true }
);

export default model("Expense", ExpenseSchema);
