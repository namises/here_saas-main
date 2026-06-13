import { Schema, model } from "mongoose";

const CompanyDocumentSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ["policy", "contract", "license", "certificate", "handbook", "form", "other"], default: "policy" },
    fileUrl: { type: String, required: true },
    fileType: String,
    version: { type: String, default: "1.0" },
    owner: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    visibility: { type: String, enum: ["all", "managers", "admins"], default: "all" },
    expiresAt: { type: Number, default: null },
    tags: [String],
  },
  { timestamps: true }
);

export default model("CompanyDocument", CompanyDocumentSchema);
