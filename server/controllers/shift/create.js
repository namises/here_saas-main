import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { timeRegex } from "../../utils/constants.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { name, startTime, endTime, gracePeriodMins, minHalfDayDuration: minFDD, minFullDayDuration: minHDD } = req.body;
    const shiftExists = await DB.Shift.findOne({ name });
    if (shiftExists) throw new Error("Shift exists with the same name");
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const [minFDDh, minFDDm] = minFDD.split(":").map(Number);
    const [minHDDh, minHDDm] = minHDD.split(":").map(Number);
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    const minFullDayDuration = minFDDh * 60 + minFDDm;
    const minHalfDayDuration = minHDDh * 60 + minHDDm;
    const isOvernight = end <= start;

    const shift = new DB.Shift({ organization, name, startTime, endTime, isOvernight, gracePeriodMins, minHalfDayDuration, minFullDayDuration });
    await shift.save();
    return handleResponse(res, { message: "Shift created successfully", shift });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  name: Joi.string().required(),
  startTime: Joi.string().pattern(timeRegex).required().label("Start Time").messages({ "string.pattern.base": "Start time must be in HH:mm 24-hour format" }),
  endTime: Joi.string().pattern(timeRegex).required().label("End Time").messages({ "string.pattern.base": "End time must be in HH:mm 24-hour format" }),
  gracePeriodMins: Joi.number().integer().min(0).default(0),
  minHalfDayDuration: Joi.string().pattern(timeRegex).label("Min Half Day Duration").messages({ "string.pattern.base": "Min Half Day Duration must be in HH:mm 24-hour format" }),
  minFullDayDuration: Joi.string().pattern(timeRegex).label("Min Full Day Duration").messages({ "string.pattern.base": "Min Full Day Duration be in HH:mm 24-hour format" }),
});

const validation = {
  schema,
  toValidate: toValidateOptions.body,
};

export default { handler, validation };
