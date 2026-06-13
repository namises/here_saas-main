import Joi from "joi";
import DB from "../../db/index.js";
import { makeCrud } from "../../utils/crudController.js";
import { objectIdValidator } from "../../utils/index.js";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const crud = makeCrud({
  Model: DB.WpsBatch,
  key: "batches",
  label: "WPS batch",
  createSchema: Joi.object({
    month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
    employerId: Joi.string().max(40).allow(""),
    bankRoutingCode: Joi.string().max(20).allow(""),
    records: Joi.array().items(Joi.object().unknown(true)),
  }),
  updateSchema: Joi.object({
    id: objectIdValidator.required(),
    status: Joi.string().valid("draft", "generated", "submitted", "accepted", "rejected"),
    employerId: Joi.string().max(40).allow(""),
    bankRoutingCode: Joi.string().max(20).allow(""),
  }),
  filterConfig: { status: { type: "string" }, month: { type: "string" } },
});

/** Build a simplified UAE WPS Salary Information File (SIF) as CSV text. */
const buildSIF = ({ employerId, bankRoutingCode, month, records, currency }) => {
  const [yr, mo] = month.split("-");
  const period = `${mo}${yr}`;
  const now = new Date();
  const total = records.reduce((s, r) => s + (Number(r.netSalary) || 0), 0);
  const lines = [];
  // SCR — Salary Control Record (header)
  lines.push(["SCR", employerId || "EID000000000", bankRoutingCode || "", period, records.length, total.toFixed(2), currency, now.toISOString().slice(0, 10)].join(","));
  // EDR — Employee Detail Records
  records.forEach((r) => {
    lines.push(
      ["EDR", r.labourCardNumber || "", r.routingCode || "", r.iban || "", (Number(r.basicSalary) || 0).toFixed(2), (Number(r.variablePay) || 0).toFixed(2), (Number(r.deductions) || 0).toFixed(2), (Number(r.netSalary) || 0).toFixed(2), r.daysOnLeave || 0].join(
        ","
      )
    );
  });
  return lines.join("\n");
};

// Generate a WPS batch for a month by aggregating employee salaries.
const generate = {
  validation: {
    schema: Joi.object({
      month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
      employerId: Joi.string().max(40).allow(""),
      bankRoutingCode: Joi.string().max(20).allow(""),
      financialYear: Joi.string().max(10).optional(),
    }),
    toValidate: toValidateOptions.body,
  },
  handler: async (req, res) => {
    try {
      const { organization, userId } = req.user;
      const { month, employerId, bankRoutingCode, financialYear } = req.body;
      const monthName = MONTHS[parseInt(month.split("-")[1], 10) - 1];

      const employees = await DB.Employee.find({ organization, status: "active" }).select("name empCode bankAccount ifsc").lean();
      const payrolls = await DB.Payroll.find({ organization, month: monthName, ...(financialYear ? { financialYear } : {}) }).lean();
      const ctcs = await DB.CTC.find({ organization }).lean();
      const payrollByEmp = Object.fromEntries(payrolls.map((p) => [String(p.employee), p]));
      const ctcByEmp = Object.fromEntries(ctcs.map((c) => [String(c.employee), c]));

      const records = employees.map((e) => {
        const p = payrollByEmp[String(e._id)];
        const c = ctcByEmp[String(e._id)];
        const monthlyCtc = c?.totalCTC ? Math.round(c.totalCTC / 12) : 0;
        const net = p?.netSalary ?? monthlyCtc;
        const gross = p?.grossSalary ?? monthlyCtc;
        const deductions = Math.max(0, gross - net);
        return {
          employee: e._id,
          employeeName: e.name,
          labourCardNumber: e.empCode || "",
          routingCode: bankRoutingCode || "",
          iban: e.bankAccount || "",
          basicSalary: gross,
          variablePay: 0,
          deductions,
          netSalary: net,
          daysOnLeave: p ? Math.max(0, (p.totalWorkingDays || 0) - (p.presentDays || 0)) : 0,
        };
      });

      const totalAmount = records.reduce((s, r) => s + (r.netSalary || 0), 0);
      const sifContent = buildSIF({ employerId, bankRoutingCode, month, records, currency: "AED" });
      const sifFileName = `WPS_${organization}_${month}.sif`;

      const batch = await DB.WpsBatch.create({
        organization,
        month,
        employerId,
        bankRoutingCode,
        totalRecords: records.length,
        totalAmount,
        currency: "AED",
        records,
        status: "generated",
        sifFileName,
        generatedBy: userId,
      });

      return handleResponse(res, { message: "WPS batch generated", batch, sifContent, sifFileName });
    } catch (error) {
      return handleError(res, error, error?.message);
    }
  },
};

// Return SIF text for an existing batch (for download on the client).
const download = {
  validation: { schema: Joi.object({ id: objectIdValidator.required() }), toValidate: toValidateOptions.query },
  handler: async (req, res) => {
    try {
      const { organization } = req.user;
      const { id } = req.queryParams;
      const batch = await DB.WpsBatch.findOne({ _id: id, organization }).lean();
      if (!batch) throw new Error("WPS batch not found");
      const sifContent = buildSIF({ employerId: batch.employerId, bankRoutingCode: batch.bankRoutingCode, month: batch.month, records: batch.records, currency: batch.currency });
      return handleResponse(res, { message: "SIF content", sifContent, sifFileName: batch.sifFileName });
    } catch (error) {
      return handleError(res, error, error?.message);
    }
  },
};

export default { ...crud, generate, download };
