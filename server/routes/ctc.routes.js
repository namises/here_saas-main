import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const ctcRouter = express.Router();

//ctc routes
ctcRouter.post("/create", validate(controllers.ctc.create.validation), controllers.ctc.create.handler);
ctcRouter.post("/update", validate(controllers.ctc.update.validation), controllers.ctc.update.handler);
ctcRouter.get("/list", validate(controllers.ctc.list.validation), controllers.ctc.list.handler);

export default ctcRouter;
