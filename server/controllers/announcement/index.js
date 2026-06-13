import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  title: Joi.string().min(2).max(160),
  body: Joi.string().min(2).max(4000),
  category: Joi.string().valid("general", "policy", "event", "holiday", "celebration", "urgent"),
  priority: Joi.string().valid("low", "normal", "high"),
  audience: Joi.string().valid("all", "branch", "department"),
  branch: objectIdValidator.allow(null),
  department: objectIdValidator.allow(null),
  pinned: Joi.boolean(),
  expiresAt: Joi.number().allow(null),
};

const crud = makeCrud({
  Model: DB.Announcement,
  key: "announcements",
  label: "Announcement",
  createSchema: Joi.object({ ...base, title: base.title.required(), body: base.body.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { category: { type: "string" }, priority: { type: "string" }, title: { type: "string", mode: "partial" } },
  populate: { path: "publishedBy", select: "name email" },
  beforeCreate: (payload, req) => ({ ...payload, publishedBy: req.user.userId }),
});

export default crud;
