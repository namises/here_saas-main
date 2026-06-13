import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  name: Joi.string().min(2).max(120),
  assetTag: Joi.string().min(1).max(40),
  category: Joi.string().valid("laptop", "mobile", "vehicle", "furniture", "software", "accessory", "other"),
  serialNumber: Joi.string().max(80).allow(""),
  purchaseDate: Joi.number().allow(null),
  purchaseCost: Joi.number().min(0),
  warrantyExpiry: Joi.number().allow(null),
  status: Joi.string().valid("available", "assigned", "maintenance", "retired"),
  assignedTo: objectIdValidator.allow(null),
  assignedDate: Joi.number().allow(null),
  branch: objectIdValidator.allow(null),
  condition: Joi.string().valid("new", "good", "fair", "poor"),
  notes: Joi.string().max(500).allow(""),
};

const crud = makeCrud({
  Model: DB.Asset,
  key: "assets",
  label: "Asset",
  createSchema: Joi.object({ ...base, name: base.name.required(), assetTag: base.assetTag.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { status: { type: "string" }, category: { type: "string" }, name: { type: "string", mode: "partial" } },
  populate: [
    { path: "assignedTo", select: "name email empCode" },
    { path: "branch", select: "name code" },
  ],
});

export default crud;
