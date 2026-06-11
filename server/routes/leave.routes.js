import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const leaveRouter = express.Router();

//leave routes
leaveRouter.post("/policy/create", validate(controllers.leave.policy.create.validation), controllers.leave.policy.create.handler);
leaveRouter.post("/policy/update", validate(controllers.leave.policy.update.validation), controllers.leave.policy.update.handler);
leaveRouter.get("/policy/list", validate(controllers.leave.policy.list.validation), controllers.leave.policy.list.handler);
leaveRouter.post("/request", validate(controllers.leave.request.validation), controllers.leave.request.handler);
leaveRouter.post("/update", validate(controllers.leave.update.validation), controllers.leave.update.handler);
leaveRouter.post("/approve", validate(controllers.leave.approve.validation), controllers.leave.approve.handler);
leaveRouter.post("/reject", validate(controllers.leave.reject.validation), controllers.leave.reject.handler);
leaveRouter.get("/list", validate(controllers.leave.list.validation), controllers.leave.list.handler);
leaveRouter.get("/balance", validate(controllers.leave.balance.validation), controllers.leave.balance.handler);

export default leaveRouter;
