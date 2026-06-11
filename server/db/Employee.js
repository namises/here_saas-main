import { Schema, model } from "mongoose";
import { FILE_URL_REGEX, IFSC_REGEX, PAN_REGEX } from "../utils/index.js";

const DocumentSchema = new Schema({ name: { type: String, reqired: true }, url: { type: String, reqired: true }, type: { type: String, reqired: true } }, { _id: false });
const LeaveBalanceSchema = new Schema(
  {
    //
    leaveType: { type: String, required: true },
    code: { type: String, required: true },
    credited: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
    carryForwarded: { type: Number, default: 0 },
  },
  { _id: false }
);
const EmployeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: String, unique: true },
    organization: { type: Schema.Types.ObjectId, ref: "Organization", default: null }, // Nullable for super admin
    shift: { type: Schema.Types.ObjectId, ref: "Shift", default: null }, // Nullable for super admin
    isSuperAdmin: { type: Boolean, default: false },
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    dob: { type: Number, reqired: true },
    joiningDate: { type: Number, reqired: true },
    designation: String,
    empCode: String,
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    manager: { type: Schema.Types.ObjectId, ref: "Employee" },
    status: { type: String, enum: ["active", "inactive", "resigned", "terminated"], default: "active" },
    documents: [DocumentSchema],
    leaveBalances: { type: [LeaveBalanceSchema], allowNull: true },
    _leaveMeta: {
      type: Map,
      of: Boolean,
      default: {},
    },
    hashedPassword: { type: String, required: true },
    pan: {
      type: String,
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
    photo: {
      type: String,
      validate: {
        validator: function (value) {
          return FILE_URL_REGEX.test(value);
        },
        message: (props) => `${props.value} is not a valid file url.`,
      },
    },
    bankAccount: { type: String },
    ifsc: {
      type: String,
      uppercase: true,
      trim: true,
      minlength: 11,
      maxlength: 11,
      validate: {
        validator: function (value) {
          return IFSC_REGEX.test(value);
        },
        message: (props) => `${props.value} is not a valid IFSC code.`,
      },
    },
  },
  { timestamps: true }
);

const Employee = model("Employee", EmployeeSchema);

export default Employee;
