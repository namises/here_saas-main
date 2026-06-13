import { Schema, model } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, enum: ["general", "policy", "event", "holiday", "celebration", "urgent"], default: "general" },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    audience: { type: String, enum: ["all", "branch", "department"], default: "all" },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", default: null },
    department: { type: Schema.Types.ObjectId, ref: "Department", default: null },
    pinned: { type: Boolean, default: false },
    publishedBy: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    expiresAt: { type: Number, default: null },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

export default model("Announcement", AnnouncementSchema);
