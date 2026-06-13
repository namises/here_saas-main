import { Schema, model } from "mongoose";

const RatingSchema = new Schema({ competency: { type: String, required: true }, score: { type: Number, min: 0, max: 5, default: 0 } }, { _id: false });

const PerformanceReviewSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
    cycle: { type: String, required: true }, // e.g. "2026-H1"
    period: { type: String, enum: ["quarterly", "half-yearly", "annual"], default: "annual" },
    ratings: { type: [RatingSchema], default: [] },
    overallRating: { type: Number, min: 0, max: 5, default: 0 },
    strengths: String,
    improvements: String,
    goalsAchieved: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "self-review", "manager-review", "completed"], default: "draft" },
  },
  { timestamps: true }
);

export default model("PerformanceReview", PerformanceReviewSchema);
