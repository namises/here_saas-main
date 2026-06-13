import { Schema, model } from "mongoose";

const JobSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", default: null },
    department: { type: Schema.Types.ObjectId, ref: "Department", default: null },
    title: { type: String, required: true },
    code: String,
    description: String,
    employmentType: { type: String, enum: ["full-time", "part-time", "contract", "internship"], default: "full-time" },
    location: String,
    openings: { type: Number, default: 1 },
    minSalary: { type: Number, default: 0 },
    maxSalary: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "on-hold", "closed", "filled"], default: "open" },
    hiringManager: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
  },
  { timestamps: true }
);

export default model("Job", JobSchema);
