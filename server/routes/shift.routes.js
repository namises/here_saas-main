import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const shiftRouter = express.Router();

//shift routes
shiftRouter.post("/create", validate(controllers.shift.create.validation), controllers.shift.create.handler);
shiftRouter.get("/list", validate(controllers.shift.list.validation), controllers.shift.list.handler);
shiftRouter.post("/update", validate(controllers.shift.update.validation), controllers.shift.update.handler);
shiftRouter.post("/delete", validate(controllers.shift.delete.validation), controllers.shift.delete.handler);

export default shiftRouter;
