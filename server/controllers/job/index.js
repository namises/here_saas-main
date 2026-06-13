import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  title: Joi.string().min(2).max(120),
  code: Joi.string().max(30).allow(""),
  description: Joi.string().max(4000).allow(""),
  branch: objectIdValidator.allow(null),
  department: objectIdValidator.allow(null),
  employmentType: Joi.string().valid("full-time", "part-time", "contract", "internship"),
  location: Joi.string().max(120).allow(""),
  openings: Joi.number().min(1),
  minSalary: Joi.number().min(0),
  maxSalary: Joi.number().min(0),
  status: Joi.string().valid("open", "on-hold", "closed", "filled"),
  hiringManager: objectIdValidator.allow(null),
};

const crud = makeCrud({
  Model: DB.Job,
  key: "jobs",
  label: "Job",
  createSchema: Joi.object({ ...base, title: base.title.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { status: { type: "string" }, employmentType: { type: "string" }, title: { type: "string", mode: "partial" } },
  populate: [
    { path: "department", select: "name code" },
    { path: "branch", select: "name code" },
  ],
});

export default crud;
