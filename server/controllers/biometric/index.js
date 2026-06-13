import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  branch: objectIdValidator.allow(null),
  name: Joi.string().min(2).max(80),
  serialNumber: Joi.string().min(1).max(60),
  deviceType: Joi.string().valid("fingerprint", "face", "iris", "rfid", "hybrid"),
  vendor: Joi.string().max(60).allow(""),
  ipAddress: Joi.string().max(45).allow(""),
  location: Joi.string().max(120).allow(""),
  firmware: Joi.string().max(40).allow(""),
  enrolledUsers: Joi.number().min(0),
  lastSyncAt: Joi.number().allow(null),
  status: Joi.string().valid("online", "offline", "maintenance"),
};

const crud = makeCrud({
  Model: DB.BiometricDevice,
  key: "devices",
  label: "Biometric device",
  createSchema: Joi.object({ ...base, name: base.name.required(), serialNumber: base.serialNumber.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { status: { type: "string" }, deviceType: { type: "string" }, name: { type: "string", mode: "partial" } },
  populate: { path: "branch", select: "name code" },
});

export default crud;
