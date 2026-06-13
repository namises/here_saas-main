import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  name: Joi.string().min(2).max(80),
  code: Joi.string().min(1).max(16),
  emirate: Joi.string().max(40),
  city: Joi.string().max(60),
  address: Joi.string().max(240),
  timezone: Joi.string().max(60),
  manager: objectIdValidator.allow(null),
  phone: Joi.string().max(20),
  isHeadOffice: Joi.boolean(),
  status: Joi.string().valid("active", "inactive"),
};

const crud = makeCrud({
  Model: DB.Branch,
  key: "branches",
  label: "Branch",
  createSchema: Joi.object({ ...base, name: base.name.required(), code: base.code.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { status: { type: "string" }, emirate: { type: "string", mode: "partial" }, name: { type: "string", mode: "partial" } },
  populate: { path: "manager", select: "name email" },
});

export default crud;
