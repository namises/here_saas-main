import { Schema, model } from "mongoose";
import { FILE_URL_REGEX, PAN_REGEX } from "../utils/index.js";

const LeavePolicySchema = new Schema(
  {
    //
    leaveType: { type: String, required: true },
    code: { type: String, required: true },
    maxPerYear: { type: Number, required: true },
    accrualFrequency: { type: String, enum: ["monthly", "quarterly", "annually"], default: "monthly" },
    carryForward: { type: Boolean, default: false },
    encashable: { type: Boolean, default: false },
    maxCarryForward: { type: Number, default: 0 },
    maxEncashable: { type: Number, default: 0 },
    applicableAfterMonths: { type: Number, default: 0 },
  },
  { _id: true }
);

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    domain: { type: String, match: [/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, "Please enter a valid domain name"], unique: true, required: true },
    address: String,
    isActive: { type: Boolean, default: true },
    subscription: {
      plan: { type: String, default: "basic" },
      expiresAt: { type: Number, default: () => Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 }, // Unix timestamp in seconds + 7 days later will be used in middleware
      isTrial: { type: Boolean, default: true },
    },
    leavePolicy: [LeavePolicySchema],
    pan: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
      validate: {
        validator: function (value) {
          return PAN_REGEX.test(value);
        },
        message: (props) => `${props.value} is not a valid PAN format (AAAAA9999A).`,
      },
    },
    logo: {
      type: String,
      validate: {
        validator: function (value) {
          return FILE_URL_REGEX.test(value);
        },
        message: (props) => `${props.value} is not a valid file url.`,
      },
    },
    email: { type: String, unique: true, required: true },
    mobile: { type: String, unique: true },
    attendancePunchType: { type: String, enum: ["qr", "selfie", "both"], default: "qr" },
  },
  { timestamps: true }
);

const Organization = model("Organization", OrganizationSchema);

export default Organization;
