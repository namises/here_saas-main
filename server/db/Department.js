import { Schema, model } from "mongoose";

const DepartmentSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    name: { type: String, required: true },
    code: String,
    description: String,
  },
  { timestamps: true }
);

const Department = model("Department", DepartmentSchema);

export default Department;
