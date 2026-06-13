import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";

const DAY = 24 * 60 * 60;
export const computeStatus = (expiryDate) => {
  if (!expiryDate) return "valid";
  const now = Math.floor(Date.now() / 1000);
  if (expiryDate < now) return "expired";
  if (expiryDate < now + 30 * DAY) return "expiring-soon";
  return "valid";
};

const base = {
  employee: objectIdValidator,
  documentType: Joi.string().valid("emirates-id", "residence-visa", "labour-card", "passport", "work-permit", "health-insurance", "labour-contract"),
  documentNumber: Joi.string().min(1).max(60),
  issuingEmirate: Joi.string().max(40),
  issueDate: Joi.number().allow(null),
  expiryDate: Joi.number(),
  fileUrl: Joi.string().max(500).allow(""),
  status: Joi.string().valid("valid", "expiring-soon", "expired", "under-renewal"),
  notes: Joi.string().max(500).allow(""),
};

const crud = makeCrud({
  Model: DB.ComplianceRecord,
  key: "records",
  label: "Compliance record",
  createSchema: Joi.object({ ...base, employee: base.employee.required(), documentType: base.documentType.required(), documentNumber: base.documentNumber.required(), expiryDate: base.expiryDate.required() }),
  updateSchema: Joi.object({ id: objectIdValidator.required(), ...base }),
  filterConfig: { status: { type: "string" }, documentType: { type: "string" }, employee: { type: "objectId" } },
  populate: { path: "employee", select: "name email empCode designation" },
  beforeCreate: (payload) => ({ ...payload, status: payload.status === "under-renewal" ? "under-renewal" : computeStatus(payload.expiryDate) }),
});

// Compliance dashboard summary: counts by status, by type, and soonest expiries.
const stats = {
  validation: { schema: Joi.object({}).unknown(true), toValidate: toValidateOptions.query },
  handler: async (req, res) => {
    try {
      const { organization } = req.user;
      const now = Math.floor(Date.now() / 1000);
      const records = await DB.ComplianceRecord.find({ organization }).populate("employee", "name empCode").lean();

      const byStatus = { valid: 0, "expiring-soon": 0, expired: 0, "under-renewal": 0 };
      const byType = {};
      records.forEach((r) => {
        const status = r.status === "under-renewal" ? "under-renewal" : computeStatus(r.expiryDate);
        byStatus[status] = (byStatus[status] || 0) + 1;
        byType[r.documentType] = (byType[r.documentType] || 0) + 1;
      });

      const upcoming = records
        .filter((r) => r.expiryDate >= now && r.expiryDate < now + 60 * DAY)
        .sort((a, b) => a.expiryDate - b.expiryDate)
        .slice(0, 10);

      return handleResponse(res, { message: "Compliance stats", stats: { total: records.length, byStatus, byType, upcoming } });
    } catch (error) {
      return handleError(res, error, error?.message);
    }
  },
};

export default { ...crud, stats };
