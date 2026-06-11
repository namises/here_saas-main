import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const financialYearRouter = express.Router();

//financialYear routes
financialYearRouter.get("/list", validate(controllers.financialYear.list.validation), controllers.financialYear.list.handler);

export default financialYearRouter;
