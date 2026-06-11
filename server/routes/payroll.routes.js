import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const payrollRouter = express.Router();

//payroll routes
payrollRouter.get("/list", validate(controllers.payroll.list.validation), controllers.payroll.list.handler);
payrollRouter.get("/export", validate(controllers.payroll.export.validation), controllers.payroll.export.handler);
payrollRouter.get("/paySlip", validate(controllers.payroll.paySlip.validation), controllers.payroll.paySlip.handler);
payrollRouter.post("/update", validate(controllers.payroll.update.validation), controllers.payroll.update.handler);

export default payrollRouter;
