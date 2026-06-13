import Joi from "joi";
import mongoose from "mongoose";
import DB from "../../db/index.js";
import { handleError, handleResponse } from "../../utils/handlers.js";
import { toValidateOptions } from "../../middlewares/validator.js";
import { computeStatus } from "../compliance/index.js";

const oid = (id) => mongoose.Types.ObjectId.createFromHexString(`${id}`);

const fmtDate = (n) => {
  if (!n && n !== 0) return "";
  let ms = n;
  if (n < 1e10) ms = n * 1000; // seconds -> ms
  const d = new Date(ms);
  if (isNaN(d.getTime())) return `${n}`;
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

const toSeries = (obj) => Object.entries(obj).map(([label, value]) => ({ label, value }));

// Aggregated overview for the main dashboard.
const overview = {
  validation: { schema: Joi.object({}).unknown(true), toValidate: toValidateOptions.query },
  handler: async (req, res) => {
    try {
      const organization = oid(req.user.organization);

      const [employees, departments, branches, openJobs, candidates, assets, pendingExpenses, pendingApprovals, pendingLeaves, complianceRecords, announcements, expenses, attAgg, deptAgg] = await Promise.all([
        DB.Employee.countDocuments({ organization, status: "active" }),
        DB.Department.countDocuments({ organization }),
        DB.Branch.countDocuments({ organization }).catch(() => 0),
        DB.Job.countDocuments({ organization, status: "open" }).catch(() => 0),
        DB.Candidate.find({ organization }).select("stage source").lean().catch(() => []),
        DB.Asset.find({ organization }).select("status category purchaseCost").lean().catch(() => []),
        DB.Expense.countDocuments({ organization, status: "pending" }).catch(() => 0),
        DB.ApprovalRequest.countDocuments({ organization, status: "pending" }).catch(() => 0),
        DB.LeaveRequest.countDocuments({ organization, status: "pending" }).catch(() => 0),
        DB.ComplianceRecord.find({ organization }).select("status documentType expiryDate").lean().catch(() => []),
        DB.Announcement.find({ organization }).sort({ pinned: -1, createdAt: -1 }).limit(5).populate("publishedBy", "name").lean().catch(() => []),
        DB.Expense.find({ organization }).select("category amount status").lean().catch(() => []),
        DB.Attendance.aggregate([
          { $match: { organization } },
          { $group: { _id: "$date", present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } }, leave: { $sum: { $cond: [{ $eq: ["$status", "leave"] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } } } },
          { $sort: { _id: 1 } },
        ]).catch(() => []),
        DB.Employee.aggregate([{ $match: { organization } }, { $group: { _id: "$status", count: { $sum: 1 } } }]).catch(() => []),
      ]);

      // candidates funnel
      const stageOrder = ["applied", "screening", "interview", "offer", "hired"];
      const stageCount = {};
      candidates.forEach((c) => (stageCount[c.stage] = (stageCount[c.stage] || 0) + 1));
      const recruitmentFunnel = stageOrder.map((s) => ({ label: s, value: stageCount[s] || 0 }));

      // assets by status
      const assetStatus = {};
      let assetValue = 0;
      assets.forEach((a) => {
        assetStatus[a.status] = (assetStatus[a.status] || 0) + 1;
        assetValue += Number(a.purchaseCost) || 0;
      });

      // compliance summary
      const complianceStatus = { valid: 0, "expiring-soon": 0, expired: 0, "under-renewal": 0 };
      complianceRecords.forEach((r) => {
        const st = r.status === "under-renewal" ? "under-renewal" : computeStatus(r.expiryDate);
        complianceStatus[st] = (complianceStatus[st] || 0) + 1;
      });

      // expenses by category (approved + pending sum)
      const expenseByCategory = {};
      let expensePending = 0;
      expenses.forEach((e) => {
        expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + (Number(e.amount) || 0);
        if (e.status === "pending") expensePending += Number(e.amount) || 0;
      });

      const employeesByStatus = deptAgg.map((d) => ({ label: d._id || "unknown", value: d.count }));
      const attendanceTrend = attAgg.slice(-7).map((d) => ({ label: fmtDate(d._id), value: d.present }));

      return handleResponse(res, {
        message: "Overview",
        overview: {
          kpis: { employees, departments, branches, openJobs, candidates: candidates.length, assets: assets.length, assetValue, pendingExpenses, pendingApprovals, pendingLeaves, expensePending },
          employeesByStatus,
          attendanceTrend,
          recruitmentFunnel,
          assetsByStatus: toSeries(assetStatus),
          complianceStatus: toSeries(complianceStatus),
          expenseByCategory: toSeries(expenseByCategory),
          announcements,
        },
      });
    } catch (error) {
      return handleError(res, error, error?.message);
    }
  },
};

// Headcount-style reports for the reporting page.
const headcount = {
  validation: { schema: Joi.object({}).unknown(true), toValidate: toValidateOptions.query },
  handler: async (req, res) => {
    try {
      const organization = oid(req.user.organization);
      const [byDept, byDesignation, joinTrend] = await Promise.all([
        DB.Employee.aggregate([
          { $match: { organization } },
          { $lookup: { from: "departments", localField: "department", foreignField: "_id", as: "dept" } },
          { $group: { _id: { $ifNull: [{ $arrayElemAt: ["$dept.name", 0] }, "Unassigned"] }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]).catch(() => []),
        DB.Employee.aggregate([{ $match: { organization } }, { $group: { _id: { $ifNull: ["$designation", "N/A"] }, count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 8 }]).catch(() => []),
        DB.Employee.aggregate([
          { $match: { organization, joiningDate: { $ne: null } } },
          { $group: { _id: { $dateToString: { format: "%Y-%m", date: { $toDate: { $multiply: ["$joiningDate", 1000] } } } }, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $limit: 12 },
        ]).catch(() => []),
      ]);

      return handleResponse(res, {
        message: "Headcount report",
        report: {
          byDepartment: byDept.map((d) => ({ label: d._id, value: d.count })),
          byDesignation: byDesignation.map((d) => ({ label: d._id, value: d.count })),
          joinTrend: joinTrend.map((d) => ({ label: d._id, value: d.count })),
        },
      });
    } catch (error) {
      return handleError(res, error, error?.message);
    }
  },
};

export default { overview, headcount };
