import { Schema, model } from "mongoose";

const LeaveRequestSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    fromDate: Number,
    toDate: Number,
    leaveType: { type: String },
    days: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reason: String,
    owner: { type: Schema.Types.ObjectId, ref: "Employee" },
    // Who actioned (approved/rejected) the leave, and when.
    approvedBy: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    actionedAt: { type: Number, default: null },
  },
  { timestamps: true }
);

const LeaveRequest = model("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
