import Joi from "joi";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { timeRegex } from "../../utils/constants.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { objectIdValidator } from "../../utils/index.js";
import DB from "../../db/index.js";

async function handler(req, res) {
  try {
    const { organization } = req.user;
    const { shiftId, name, startTime: _startTime, endTime: _endTime, gracePeriodMins, minHalfDayDuration: minFDD, minFullDayDuration: minHDD } = req.body;
    const existingShift = await DB.Shift.findOne({ _id: shiftId, organization });
    if (!existingShift) throw new Error("Shift does not exists");
    const startTime = _startTime ?? existingShift.startTime;
    const endTime = _endTime ?? existingShift.endTime;
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const [minFDDh, minFDDm] = minFDD.split(":").map(Number);
    const [minHDDh, minHDDm] = minHDD.split(":").map(Number);
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    const minFullDayDuration = minFDDh * 60 + minFDDm;
    const minHalfDayDuration = minHDDh * 60 + minHDDm;
    const isOvernight = end <= start;

    existingShift.startTime = startTime;
    existingShift.endTime = endTime;
    existingShift.isOvernight = isOvernight;
    existingShift.minFullDayDuration = minFullDayDuration;
    existingShift.minHalfDayDuration = minHalfDayDuration;

    if (name) existingShift.name = name;
    if (gracePeriodMins) existingShift.gracePeriodMins = gracePeriodMins;
    const shift = await existingShift.save();
    return handleResponse(res, { message: "Shift updated successfully", shift });
  } catch (error) {
    return handleError(res, error);
  }
}

const schema = Joi.object({
  shiftId: objectIdValidator.required(),
  name: Joi.string(),
  startTime: Joi.string().pattern(timeRegex).label("Start Time").messages({ "string.pattern.base": "Start time must be in HH:mm 24-hour format" }),
  endTime: Joi.string().pattern(timeRegex).label("End Time").messages({ "string.pattern.base": "End time must be in HH:mm 24-hour format" }),
  gracePeriodMins: Joi.number().integer(),
  minHalfDayDuration: Joi.string().pattern(timeRegex).label("Min Half Day Duration").messages({ "string.pattern.base": "Min Half Day Duration must be in HH:mm 24-hour format" }),
  minFullDayDuration: Joi.string().pattern(timeRegex).label("Min Full Day Duration").messages({ "string.pattern.base": "Min Full Day Duration be in HH:mm 24-hour format" }),
});

const validation = { schema, toValidate: toValidateOptions.body };

export default { handler, validation };
