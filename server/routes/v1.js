import express from "express";

import { verifyToken } from "../middlewares/verify.js";
import rbac from "../middlewares/rbac.js";

import employeeRouter from "./employee.routes.js";
import authRouter from "./auth.routes.js";
import departmentRouter from "./department.routes.js";
import hierarchyRouter from "./hierarchy.routes.js";
import attendanceRouter from "./attendance.routes.js";
import leaveRouter from "./leave.routes.js";
import ctcRouter from "./ctc.routes.js";
import payrollRouter from "./payroll.routes.js";
import financialYearRouter from "./financialYear.routes.js";
import shiftRouter from "./shift.routes.js";
import holidayRouter from "./holiday.routes.js";
import workDaysRouter from "./workDays.routes.js";
import mediaRouter from "./media.routes.js";
import fcmRouter from "./fcm.routes.js";
import permissionRouter from "./permission.routes.js";
import organizationRouter from "./organization.routes.js";

// New modules
import branchRouter from "./branch.routes.js";
import assetRouter from "./asset.routes.js";
import expenseRouter from "./expense.routes.js";
import announcementRouter from "./announcement.routes.js";
import jobRouter from "./job.routes.js";
import candidateRouter from "./candidate.routes.js";
import performanceRouter from "./performance.routes.js";
import goalRouter from "./goal.routes.js";
import documentRouter from "./document.routes.js";
import approvalRouter from "./approval.routes.js";
import complianceRouter from "./compliance.routes.js";
import wpsRouter from "./wps.routes.js";
import biometricRouter from "./biometric.routes.js";
import analyticsRouter from "./analytics.routes.js";

const rootRouter = express.Router();

rootRouter.use("/v1/auth", authRouter);
rootRouter.use("/v1/department", verifyToken, rbac, departmentRouter);
rootRouter.use("/v1/employee", verifyToken, rbac, employeeRouter);
rootRouter.use("/v1/hierarchy", verifyToken, rbac, hierarchyRouter);
rootRouter.use("/v1/attendance", verifyToken, rbac, attendanceRouter);
rootRouter.use("/v1/leave", verifyToken, rbac, leaveRouter);
rootRouter.use("/v1/financialYear", verifyToken, rbac, financialYearRouter);
rootRouter.use("/v1/ctc", verifyToken, rbac, ctcRouter);
rootRouter.use("/v1/payroll", verifyToken, rbac, payrollRouter);
rootRouter.use("/v1/shift", verifyToken, rbac, shiftRouter);
rootRouter.use("/v1/holiday", verifyToken, rbac, holidayRouter);
rootRouter.use("/v1/workDays", verifyToken, rbac, workDaysRouter);
rootRouter.use("/v1/media", verifyToken, rbac, mediaRouter);
rootRouter.use("/v1/fcm", verifyToken, rbac, fcmRouter);
rootRouter.use("/v1/permission", verifyToken, rbac, permissionRouter);
rootRouter.use("/v1/organization", verifyToken, rbac, organizationRouter);

// New modules
rootRouter.use("/v1/branch", verifyToken, rbac, branchRouter);
rootRouter.use("/v1/asset", verifyToken, rbac, assetRouter);
rootRouter.use("/v1/expense", verifyToken, rbac, expenseRouter);
rootRouter.use("/v1/announcement", verifyToken, rbac, announcementRouter);
rootRouter.use("/v1/job", verifyToken, rbac, jobRouter);
rootRouter.use("/v1/candidate", verifyToken, rbac, candidateRouter);
rootRouter.use("/v1/performance", verifyToken, rbac, performanceRouter);
rootRouter.use("/v1/goal", verifyToken, rbac, goalRouter);
rootRouter.use("/v1/document", verifyToken, rbac, documentRouter);
rootRouter.use("/v1/approval", verifyToken, rbac, approvalRouter);
rootRouter.use("/v1/compliance", verifyToken, rbac, complianceRouter);
rootRouter.use("/v1/wps", verifyToken, rbac, wpsRouter);
rootRouter.use("/v1/biometric", verifyToken, rbac, biometricRouter);
rootRouter.use("/v1/analytics", verifyToken, rbac, analyticsRouter);

export default rootRouter;
