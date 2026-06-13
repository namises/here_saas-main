import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";

const router = express.Router();
router.get("/overview", validate(controllers.analytics.overview.validation), controllers.analytics.overview.handler);
router.get("/headcount", validate(controllers.analytics.headcount.validation), controllers.analytics.headcount.handler);
export default router;
