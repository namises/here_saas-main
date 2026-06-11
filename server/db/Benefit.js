import { Schema, model } from "mongoose";

const BenefitsSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    type: { type: String, enum: ["insurance", "pf", "other"] },
    description: String,
    isActive: Boolean,
    startDate: Number,
    endDate: Number,
  },
  { timestamps: true }
);

const Benefit = model("Benefit", BenefitsSchema);

export default Benefit;
