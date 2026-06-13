import { Schema, model } from "mongoose";

const AssetSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", default: null },
    name: { type: String, required: true },
    assetTag: { type: String, required: true },
    category: { type: String, enum: ["laptop", "mobile", "vehicle", "furniture", "software", "accessory", "other"], default: "laptop" },
    serialNumber: String,
    purchaseDate: { type: Number, default: null }, // unix seconds
    purchaseCost: { type: Number, default: 0 },
    warrantyExpiry: { type: Number, default: null },
    status: { type: String, enum: ["available", "assigned", "maintenance", "retired"], default: "available" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    assignedDate: { type: Number, default: null },
    condition: { type: String, enum: ["new", "good", "fair", "poor"], default: "good" },
    notes: String,
  },
  { timestamps: true }
);

export default model("Asset", AssetSchema);
