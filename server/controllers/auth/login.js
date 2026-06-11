import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import bcrypt from "bcryptjs";
import DB from "../../db/index.js";
import { generateToken } from "../../middlewares/verify.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { validatePassword } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { email, password } = req.body;
    const employee = await DB.Employee.findOne({ email });
    if (!employee) throw new Error("User doesn't exist");
    const valid = await bcrypt.compare(password, employee.hashedPassword);
    if (!valid) throw new Error("Incorrect email or password");
    const employeeObj = employee.toJSON({ flattenObjectIds: true });
    delete employeeObj.hashedPassword, delete employeeObj.createdAt, delete employeeObj.updatedAt, delete employeeObj.__v;
    employeeObj.employee = employeeObj._id;
    const token = await generateToken(employeeObj);
    return handleResponse(res, { message: "Logged in successfully", user: employeeObj, token });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({ email: Joi.string().email().required(), password: validatePassword });
const validation = { schema, toValidate: toValidateOptions.body };
export default { handler, validation };
