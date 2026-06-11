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

export default rootRouter;
