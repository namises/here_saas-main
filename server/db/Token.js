import { Schema, model } from "mongoose";

const TokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    tokenId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const Token = model("Token", TokenSchema);

export default Token;
