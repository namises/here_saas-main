import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const organizationRouter = express.Router();

organizationRouter.get("/settings", validate(controllers.organization.getSettings.validation), controllers.organization.getSettings.handler);
organizationRouter.post("/updateSettings", validate(controllers.organization.updateSettings.validation), controllers.organization.updateSettings.handler);

export default organizationRouter;
