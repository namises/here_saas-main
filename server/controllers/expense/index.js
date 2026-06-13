import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";

const base = {
  employee: objectIdValidator,
  title: Joi.string().min(2).max(120),
  category: Joi.string().valid("travel", "food", "accommodation", "supplies", "software", "training", "other"),
  amount: Joi.number().min(0),
  currency: Joi.string().max(5),
  date: Joi.number(),
  description: Joi.string().max(500).allow(""),
  receiptUrl: Joi.string().max(500).allow(""),
  status: Joi.string().valid("pending", "approved", "rejected", "reimbursed"),
  actionComments: Joi.string().max(300).allow(""),
};

const crud = makeCrud({
  Model: DB.Expense,
  key: "expenses",
  label: "Expense",
  createSchema: Joi.object({ ...base, title: base.title.required(), amount: base.amount.required(), date: base.date.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base, approver: objectIdValidator, actionedAt: Joi.number() }),
  filterConfig: { status: { type: "string" }, category: { type: "string" }, employee: { type: "objectId" } },
  populate: { path: "employee", select: "name email empCode" },
  beforeCreate: (payload, req) => ({ ...payload, employee: payload.employee || req.user.userId, status: "pending" }),
});

export default crud;
