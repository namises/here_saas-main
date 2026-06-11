import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";

const departmentRouter = express.Router();

//department routes
departmentRouter.post("/create", validate(controllers.department.create.validation), controllers.department.create.handler);
departmentRouter.post("/update", validate(controllers.department.update.validation), controllers.department.update.handler);
departmentRouter.get("/list", validate(controllers.department.list.validation), controllers.department.list.handler);

export default departmentRouter;
