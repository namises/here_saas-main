import { Schema, model } from "mongoose";

const GoalSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    title: { type: String, required: true },
    description: String,
    category: { type: String, enum: ["business", "personal", "team", "learning"], default: "business" },
    weightage: { type: Number, min: 0, max: 100, default: 100 },
    target: { type: Number, default: 100 },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    dueDate: { type: Number, default: null },
    status: { type: String, enum: ["not-started", "in-progress", "completed", "overdue"], default: "not-started" },
  },
  { timestamps: true }
);

export default model("Goal", GoalSchema);
