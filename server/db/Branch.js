import { Schema, model } from "mongoose";

const BranchSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    emirate: { type: String, default: "Dubai" }, // UAE emirate / region
    city: String,
    address: String,
    timezone: { type: String, default: "Asia/Dubai" },
    manager: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    headcount: { type: Number, default: 0 },
    phone: String,
    isHeadOffice: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default model("Branch", BranchSchema);
