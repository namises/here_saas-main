import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  title: Joi.string().min(2).max(160),
  category: Joi.string().valid("policy", "contract", "license", "certificate", "handbook", "form", "other"),
  fileUrl: Joi.string().max(500),
  fileType: Joi.string().max(40).allow(""),
  version: Joi.string().max(20),
  owner: objectIdValidator.allow(null),
  visibility: Joi.string().valid("all", "managers", "admins"),
  expiresAt: Joi.number().allow(null),
  tags: Joi.array().items(Joi.string().max(40)),
};

const crud = makeCrud({
  Model: DB.CompanyDocument,
  key: "documents",
  label: "Document",
  createSchema: Joi.object({ ...base, title: base.title.required(), fileUrl: base.fileUrl.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { category: { type: "string" }, visibility: { type: "string" }, title: { type: "string", mode: "partial" } },
  populate: { path: "owner", select: "name email" },
  beforeCreate: (payload, req) => ({ ...payload, owner: payload.owner || req.user.userId }),
});

export default crud;
