import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const hierarchyRouter = express.Router();

//hierarchy routes
hierarchyRouter.get("/view", validate(controllers.hierarchy.view.validation), controllers.hierarchy.view.handler);

export default hierarchyRouter;
