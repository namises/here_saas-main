import { Schema, model } from "mongoose";

const HolidaySchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    financialYear: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Number, required: true },
    remarks: { type: String },
  },
  { timestamps: true }
);

const Holiday = model("Holiday", HolidaySchema);
export default Holiday;
