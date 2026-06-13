import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const ratingItem = Joi.object({ competency: Joi.string().max(80).required(), score: Joi.number().min(0).max(5).default(0) });

const base = {
  employee: objectIdValidator,
  reviewer: objectIdValidator.allow(null),
  cycle: Joi.string().max(20),
  period: Joi.string().valid("quarterly", "half-yearly", "annual"),
  ratings: Joi.array().items(ratingItem),
  overallRating: Joi.number().min(0).max(5),
  strengths: Joi.string().max(1000).allow(""),
  improvements: Joi.string().max(1000).allow(""),
  goalsAchieved: Joi.number().min(0),
  status: Joi.string().valid("draft", "self-review", "manager-review", "completed"),
};

const crud = makeCrud({
  Model: DB.PerformanceReview,
  key: "reviews",
  label: "Review",
  createSchema: Joi.object({ ...base, employee: base.employee.required(), cycle: base.cycle.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { status: { type: "string" }, cycle: { type: "string" }, employee: { type: "objectId" } },
  populate: [
    { path: "employee", select: "name email empCode designation" },
    { path: "reviewer", select: "name email" },
  ],
});

export default crud;
