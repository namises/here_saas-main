import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  job: objectIdValidator.allow(null),
  name: Joi.string().min(2).max(120),
  email: Joi.string().email(),
  phone: Joi.string().max(20).allow(""),
  resumeUrl: Joi.string().max(500).allow(""),
  source: Joi.string().valid("referral", "linkedin", "website", "agency", "walk-in", "other"),
  stage: Joi.string().valid("applied", "screening", "interview", "offer", "hired", "rejected"),
  rating: Joi.number().min(0).max(5),
  expectedSalary: Joi.number().min(0),
  noticePeriodDays: Joi.number().min(0),
  notes: Joi.string().max(1000).allow(""),
};

const crud = makeCrud({
  Model: DB.Candidate,
  key: "candidates",
  label: "Candidate",
  createSchema: Joi.object({ ...base, name: base.name.required(), email: base.email.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { stage: { type: "string" }, source: { type: "string" }, job: { type: "objectId" }, name: { type: "string", mode: "partial" } },
  populate: { path: "job", select: "title code" },
});

export default crud;
