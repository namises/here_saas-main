import { Schema, model } from "mongoose";
import { FILE_URL_REGEX, IFSC_REGEX, PAN_REGEX } from "../utils/index.js";

// Employee documents (Aadhaar, PAN, etc.). Keep _id so a specific doc can be edited/deleted by admins.
// `category` is the document type label; `uploadedBy` records who added it (admin vs the employee themselves).
const DocumentSchema = new Schema({
  name: { type: String, reqired: true },
  url: { type: String, reqired: true },
  type: { type: String, reqired: true },
  category: { type: String },
  uploadedBy: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
  uploadedByRole: { type: String, enum: ["admin", "employee"], default: "admin" },
  createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

// Prior employment history rows shown in the profile (Department / Designation / From / To).
const WorkHistorySchema = new Schema({ department: String, designation: String, from: Number, to: Number, organization: String }, { _id: true });
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
    // Per-employee attendance punch method (manager-controlled). null => fall back to org-wide setting.
    attendancePunchType: { type: String, enum: ["qr", "selfie", null], default: null },
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

    // ---- Expanded profile: Personal ----
    gender: { type: String, enum: ["male", "female", "other", null], default: null },
    bloodGroup: { type: String, default: null },
    maritalStatus: { type: String, enum: ["single", "married", "divorced", "widowed", null], default: null },

    // ---- Contact ----
    personalEmail: { type: String, default: null },
    alternateMobile: { type: String, default: null },
    address: { type: String, default: null },

    // ---- Work ----
    dateOfJoining: { type: Number, default: null }, // mirror of joiningDate for the expanded profile UI
    probationPeriodMonths: { type: Number, default: null },
    probationStatus: { type: String, enum: ["on-probation", "confirmed", "extended", null], default: null },
    employeeType: { type: String, enum: ["full-time", "part-time", "contract", "intern", null], default: null },
    workLocation: { type: String, default: null },
    workExperienceYears: { type: Number, default: null },
    billingStatus: { type: String, enum: ["billable", "non-billable", null], default: null },

    // ---- Work info ----
    jobTitle: { type: String, default: null },
    subDepartment: { type: String, default: null },
    workHistory: { type: [WorkHistorySchema], default: [] },

    // ---- Resignation info ----
    resignation: {
      resignedOn: { type: Number, default: null },
      lastWorkingDay: { type: Number, default: null },
      reason: { type: String, default: null },
      noticePeriodDays: { type: Number, default: null },
      status: { type: String, enum: ["none", "submitted", "approved", "withdrawn", "completed"], default: "none" },
    },

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
