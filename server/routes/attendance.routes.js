import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const attendanceRouter = express.Router();

//auth routes
attendanceRouter.post("/mark", validate(controllers.attendance.mark.validation), controllers.attendance.mark.handler);
attendanceRouter.post("/markSelfie", validate(controllers.attendance.markSelfie.validation), controllers.attendance.markSelfie.handler);
attendanceRouter.post("/request", validate(controllers.attendance.request.validation), controllers.attendance.request.handler);
attendanceRouter.post("/approve", validate(controllers.attendance.approve.validation), controllers.attendance.approve.handler);
attendanceRouter.post("/reject", validate(controllers.attendance.reject.validation), controllers.attendance.reject.handler);
attendanceRouter.get("/list", validate(controllers.attendance.list.validation), controllers.attendance.list.handler);
attendanceRouter.get("/export", validate(controllers.attendance.export.validation), controllers.attendance.export.handler);
attendanceRouter.get("/listDevice", validate(controllers.attendance.listDevice.validation), controllers.attendance.listDevice.handler);
attendanceRouter.get("/listRequests", validate(controllers.attendance.listRequests.validation), controllers.attendance.listRequests.handler);

export default attendanceRouter;
