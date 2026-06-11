import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Number, required: true },
    checkIn: Number,
    checkOut: Number,
    status: { type: String, enum: ["present", "half-day", "absent", "leave", "holiday", "week_off"] },
    location: { lat: Number, lng: Number },
    checkOutLocation: { lat: Number, lng: Number },
    selfie: {
      checkIn: { type: String },
      checkOut: { type: String },
    },
    punchType: { type: String, enum: ["qr", "selfie"], default: "qr" },
    requested: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AttendanceSchema.virtual("attendanceRequest", {
  ref: "AttendanceRequest",
  localField: "_id",
  foreignField: "attendance",
  justOne: true,
});

AttendanceSchema.set("toObject", { virtuals: true });
AttendanceSchema.set("toJSON", { virtuals: true });

const Attendance = model("Attendance", AttendanceSchema);

export default Attendance;
