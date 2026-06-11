import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import DB from "../../db/index.js";
import { toValidateOptions } from "../../middlewares/validator.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    let device = await DB.AttendanceCode.findOne({ organization });
    const url = `${process.env.CLIENT_URI}/attendanceDeviceLogin?login=${device.deviceId}&pass=${device.loginPassword}&org=${device.organization}&id=${device._id}`;
    return handleResponse(res, { message: "Attendance devices Fetched Successfully", url });
  } catch (error) {
    return handleError(res, error, error?.message);
  }
}
const schema = Joi.object().keys({});
const validation = { schema, toValidate: toValidateOptions.query };
export default { handler, validation };
