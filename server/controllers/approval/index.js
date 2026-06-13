import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";

const stepItem = Joi.object({
  order: Joi.number().min(1).default(1),
  approver: objectIdValidator.allow(null),
  role: Joi.string().max(40).allow(""),
  status: Joi.string().valid("pending", "approved", "rejected", "skipped"),
  comments: Joi.string().max(300).allow(""),
});

const base = {
  title: Joi.string().min(2).max(160),
  type: Joi.string().valid("leave", "expense", "asset", "document", "recruitment", "custom"),
  referenceId: Joi.string().max(60).allow(""),
  amount: Joi.number().min(0),
  priority: Joi.string().valid("low", "normal", "high"),
  steps: Joi.array().items(stepItem),
  notes: Joi.string().max(1000).allow(""),
};

const crud = makeCrud({
  Model: DB.ApprovalRequest,
  key: "approvals",
  label: "Approval request",
  createSchema: Joi.object({ ...base, title: base.title.required(), type: base.type.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base, status: Joi.string().valid("pending", "approved", "rejected"), currentStep: Joi.number().min(0) }),
  filterConfig: { status: { type: "string" }, type: { type: "string" }, priority: { type: "string" } },
  populate: [
    { path: "requestedBy", select: "name email" },
    { path: "steps.approver", select: "name email" },
  ],
  beforeCreate: (payload, req) => ({ ...payload, requestedBy: req.user.userId, currentStep: 0, status: "pending" }),
});

// Approve / reject the current step of a workflow and advance it.
const act = {
  validation: {
    schema: Joi.object({
      id: objectIdValidator.required(),
      decision: Joi.string().valid("approved", "rejected").required(),
      comments: Joi.string().max(300).allow(""),
    }),
    toValidate: toValidateOptions.body,
  },
  handler: async (req, res) => {
    try {
      const { organization, userId } = req.user;
      const { id, decision, comments } = req.body;
      const doc = await DB.ApprovalRequest.findOne({ _id: id, organization });
      if (!doc) throw new Error("Approval request not found");
      if (doc.status !== "pending") throw new Error("This request is already finalised");

      const idx = doc.currentStep ?? 0;
      if (doc.steps[idx]) {
        doc.steps[idx].status = decision;
        doc.steps[idx].comments = comments;
        doc.steps[idx].actionedAt = Math.floor(Date.now() / 1000);
        if (!doc.steps[idx].approver) doc.steps[idx].approver = userId;
      }

      if (decision === "rejected") {
        doc.status = "rejected";
      } else if (idx >= doc.steps.length - 1) {
        doc.status = "approved";
      } else {
        doc.currentStep = idx + 1;
      }
      await doc.save();
      return handleResponse(res, { message: `Request ${decision}`, item: doc });
    } catch (error) {
      return handleError(res, error, error?.message);
    }
  },
};

export default { ...crud, act };
