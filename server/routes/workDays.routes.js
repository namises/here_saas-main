import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const workDaysRouter = express.Router();

//workDays routes
workDaysRouter.get("/get", validate(controllers.workDays.get.validation), controllers.workDays.get.handler);
workDaysRouter.post("/update", validate(controllers.workDays.update.validation), controllers.workDays.update.handler);

export default workDaysRouter;
