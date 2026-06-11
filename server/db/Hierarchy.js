import { Schema, model } from "mongoose";

const HierarchySchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true, unique: true },
    reportsTo: { type: Schema.Types.ObjectId, ref: "Employee" }, // nullable for top level
    level: Number, // optional level indicator
  },
  { timestamps: true }
);

const Hierarchy = model("Hierarchy", HierarchySchema);

export default Hierarchy;
