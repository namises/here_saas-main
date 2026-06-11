import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const employeeRouter = express.Router();

//employee routes
employeeRouter.post("/create", validate(controllers.employee.create.validation), controllers.employee.create.handler);
employeeRouter.post("/update", validate(controllers.employee.update.validation), controllers.employee.update.handler);
employeeRouter.get("/list", validate(controllers.employee.list.validation), controllers.employee.list.handler);
employeeRouter.get("/get", validate(controllers.employee.get.validation), controllers.employee.get.handler);

export default employeeRouter;
