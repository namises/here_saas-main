import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { timeRegex } from "../../utils/constants.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { workDays } = req.body;
    const existingWorkDays = await DB.Workdays.findOne({ organization });
    if (!existingWorkDays) throw new Error("Workdays information not found");
    existingWorkDays.workDays = workDays;
    await existingWorkDays.save();
    return handleResponse(res, { message: "Workdays updated successfully", workDays: existingWorkDays.workDays });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  workDays: Joi.array().items(Joi.boolean()).length(7).required(),
});

const validation = { schema, toValidate: toValidateOptions.body };

export default { handler, validation };
