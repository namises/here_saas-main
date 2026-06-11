import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const fcmRouter = express.Router();

//fcm routes
fcmRouter.post("/add", validate(controllers.fcm.add.validation), controllers.fcm.add.handler);

export default fcmRouter;
