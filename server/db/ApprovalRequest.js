import { Schema, model } from "mongoose";

const StepSchema = new Schema(
  {
    order: { type: Number, default: 1 },
    approver: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    role: String, // e.g. "Manager", "HR", "Finance"
    status: { type: String, enum: ["pending", "approved", "rejected", "skipped"], default: "pending" },
    comments: String,
    actionedAt: { type: Number, default: null },
  },
  { _id: false }
);

const ApprovalRequestSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["leave", "expense", "asset", "document", "recruitment", "custom"], default: "custom" },
    requestedBy: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    referenceId: String, // id of the related entity, if any
    amount: { type: Number, default: 0 },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    currentStep: { type: Number, default: 0 },
    steps: { type: [StepSchema], default: [] },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    notes: String,
  },
  { timestamps: true }
);

export default model("ApprovalRequest", ApprovalRequestSchema);
