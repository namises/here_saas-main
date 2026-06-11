import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    mobile: { type: String, unique: true },
    name: { type: String, required: true },
    hashedPassword: { type: String, required: true },
    isSuperAdmin: { type: Boolean, default: false },
    organization: { type: Schema.Types.ObjectId, ref: "Organization" }, // Nullable for super admin
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
