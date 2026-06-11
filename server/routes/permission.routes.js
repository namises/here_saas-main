import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const permissionRouter = express.Router();

//permission routes
permissionRouter.get("/get", validate(controllers.permission.get.validation), controllers.permission.get.handler);

export default permissionRouter;
