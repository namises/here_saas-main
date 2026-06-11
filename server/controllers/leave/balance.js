import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import DB from "../../db/index.js";
import { errorStrings } from "../../utils/constants.js";
import { objectIdValidator } from "../../utils/index.js";

async function handler(req, res) {
  try {
    const { matchedPermissions, organization, employee: selfEmployeeId } = req.user;
    const { employee } = req.queryParams;

    const canReadOwn = matchedPermissions.includes("leave.balance.read.own");
    const canReadAll = matchedPermissions.includes("leave.balance.read");

    let _id = null;

    if (canReadAll && employee) {
      _id = employee;
    } else {
      _id = selfEmployeeId;
    }

    if (!_id) throw new Error("Employee ID is required to fetch leave balance");
    const leaves = await DB.Employee.findOne({ organization, _id }).select("leaveBalances");
    return handleResponse(res, {
      message: "Leave Balance fetched successfully",
      leaves,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  employee: objectIdValidator,
});

const validation = {
  schema,
  toValidate: toValidateOptions.query,
};

export default { handler, validation };
