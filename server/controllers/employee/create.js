import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { timestampValidator, objectIdValidator, validatePassword, PAN_REGEX, FILE_URL_REGEX } from "../../utils/index.js";
import permissionsPresets from "../../utils/permissionsPresets.js";

async function handler(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { organization } = req.user;
    const { name, email, empCode, mobile, shift, designation, department, manager, password, documents, joiningDate, dob, pan, photo, bankAccount, ifsc, attendancePunchType } = req.body;
    // check if exists
    const existingEmployee = await DB.Employee.findOne({
      organization,
      $or: [{ email }, { mobile }],
    });
    if (existingEmployee) throw new Error("Employee exists in organization with this email or mobile");
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create Employee
    const employee = await DB.Employee.create(
      [
        {
          email,
          mobile,
          name,
          dob,
          shift,
          hashedPassword,
          permissions: permissionsPresets.employee,
          organization,
          joiningDate,
          designation,
          department,
          manager,
          documents,
          empCode,
          pan,
          photo,
          bankAccount,
          ifsc,
          attendancePunchType,
        },
      ],
      { session }
    );

    //create a doc in hierarchy
    const managerDoc = await DB.Employee.findOne({
      organization,
      _id: manager,
    });
    if (!managerDoc) throw new Error("Manager not found");
    const managerLevel = await DB.Hierarchy.findOne({
      organization,
      employee: manager,
    });
    await DB.Hierarchy.create({
      organization,
      employee: employee[0]._id,
      reportsTo: manager,
      level: managerLevel.level + 1,
    });

    await session.commitTransaction();
    session.endSession();
    return handleResponse(res, { message: "Employee created successfully.", employee });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({
  name: Joi.string().max(64).required(),
  email: Joi.string().email().required(),
  dob: timestampValidator.required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("mobile must be a 10-digit number")
    .optional(),
  joiningDate: timestampValidator.required(),
  department: objectIdValidator.optional(),
  shift: objectIdValidator.required(),
  designation: Joi.string().max(128).optional(),
  manager: objectIdValidator.required(),
  empCode: Joi.string().optional(),
  status: Joi.string().valid("active", "inactive", "resigned", "terminated").default("active"),
  password: validatePassword,
  documents: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        url: Joi.string()
          .pattern(/^https?:\/\/.*\/[^\/]+\.(webp|png|jpe?g|pdf|docx?)$/i)
          .message("Invalid file URL format")
          .required(),
        type: Joi.string().max(64).required(),
      })
    )
    .optional(),
  pan: Joi.string().uppercase().trim().length(10).pattern(PAN_REGEX).required().messages({
    "string.pattern.base": "PAN must be in the format AAAAA9999A",
    "string.length": "PAN must be exactly 10 characters",
    "any.required": "PAN is required",
  }),
  photo: Joi.string().pattern(FILE_URL_REGEX).messages({
    "string.pattern.base": "Photo Must be a valid URL",
  }),
  bankAccount: Joi.string(),
  ifsc: Joi.string(),
  attendancePunchType: Joi.string().valid("qr", "selfie").optional(),
});
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
