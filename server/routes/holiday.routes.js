import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const holidayRouter = express.Router();

//holiday routes
holidayRouter.post("/create", validate(controllers.holiday.create.validation), controllers.holiday.create.handler);
holidayRouter.get("/list", validate(controllers.holiday.list.validation), controllers.holiday.list.handler);
holidayRouter.post("/update", validate(controllers.holiday.update.validation), controllers.holiday.update.handler);
holidayRouter.post("/delete", validate(controllers.holiday.delete.validation), controllers.holiday.delete.handler);

export default holidayRouter;
