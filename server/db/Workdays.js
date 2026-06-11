import { Schema, model } from "mongoose";

const WorkdaysSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    workDays: { type: [Boolean], required: true, default: [false, true, true, true, true, true, false] },
  },
  { timestamps: true }
);

const Workdays = model("Workdays", WorkdaysSchema);
export default Workdays;
