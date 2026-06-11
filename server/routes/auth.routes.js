import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const authRouter = express.Router();

//auth routes
authRouter.post("/register", validate(controllers.auth.register.validation), controllers.auth.register.handler);
authRouter.post("/login", validate(controllers.auth.login.validation), controllers.auth.login.handler);
authRouter.post("/loginDevice", validate(controllers.auth.loginDevice.validation), controllers.auth.loginDevice.handler);

export default authRouter;
