import mongoose from "mongoose";
import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import bcrypt from "bcryptjs";
import DB from "../../db/index.js";
import permissionsPresets from "../../utils/permissionsPresets.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { PAN_REGEX, validatePassword } from "../../utils/index.js";
import { v4 as uuidv4 } from "uuid";
import { authenticator } from "otplib";

async function handler(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orgName, address, pan, domain, name, email, mobile, password } = req.body;
    const existingOrg = await DB.Organization.findOne({ $or: [{ email }, { domain }] });
    if (existingOrg) throw new Error("Organization exists with this email or domain");
    const hashedPassword = await bcrypt.hash(password, 10);
    const org = await DB.Organization.create([{ name: orgName, address, pan, domain, email, mobile }], { session });
    const organization = org[0]._id;
    //create Admin
    const employee = await DB.Employee.create([{ name, email, mobile, hashedPassword, organization, isSuperAdmin: true, permissions: [...permissionsPresets.organizationAdmin], organization, designation: "Admin", department: null, reportingManager: null, shift: null }], { session });
    //create hierarchy
    await DB.Hierarchy.create([{ organization, employee: employee[0]._id, reportsTo: null, level: 1 }], { session });
    //create TOTP secret
    const secret = authenticator.generateSecret();
    await DB.AttendanceCode.create([{ organization, deviceId: uuidv4(), secret, loginPassword: uuidv4() }], { session });
    //create workdays
    await DB.Workdays.create([{ organization, workDays: [false, true, true, true, true, true, false] }], { session });
    await session.commitTransaction();
    session.endSession();
    return handleResponse(res, { message: "Organization registered successfully", orgId: org.orgId });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(res, error, error?.message);
  }
}

const schema = Joi.object().keys({
  orgName: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(3).max(100).required(),
  pan: Joi.string().pattern(PAN_REGEX).required().messages({ "string.pattern.base": "Please provide a valid PAN.", "string.empty": "PAN is required." }),
  domain: Joi.string()
    .pattern(/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/)
    .required()
    .messages({ "string.pattern.base": "Please provide a valid domain name.", "string.empty": "Domain is required." }),
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  mobile: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  password: validatePassword,
});

const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
