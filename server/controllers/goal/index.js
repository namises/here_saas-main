import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  employee: objectIdValidator,
  title: Joi.string().min(2).max(160),
  description: Joi.string().max(1000).allow(""),
  category: Joi.string().valid("business", "personal", "team", "learning"),
  weightage: Joi.number().min(0).max(100),
  target: Joi.number().min(0),
  progress: Joi.number().min(0).max(100),
  dueDate: Joi.number().allow(null),
  status: Joi.string().valid("not-started", "in-progress", "completed", "overdue"),
};

const crud = makeCrud({
  Model: DB.Goal,
  key: "goals",
  label: "Goal",
  createSchema: Joi.object({ ...base, employee: base.employee.required(), title: base.title.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { status: { type: "string" }, category: { type: "string" }, employee: { type: "objectId" } },
  populate: { path: "employee", select: "name email empCode" },
  beforeCreate: (payload, req) => ({ ...payload, employee: payload.employee || req.user.userId }),
});

export default crud;
