import { Schema, model } from "mongoose";

const CandidateSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job", default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    resumeUrl: String,
    source: { type: String, enum: ["referral", "linkedin", "website", "agency", "walk-in", "other"], default: "website" },
    stage: { type: String, enum: ["applied", "screening", "interview", "offer", "hired", "rejected"], default: "applied" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    expectedSalary: { type: Number, default: 0 },
    noticePeriodDays: { type: Number, default: 0 },
    notes: String,
    appliedDate: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  },
  { timestamps: true }
);

export default model("Candidate", CandidateSchema);
