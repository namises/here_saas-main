import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
const mediaRouter = express.Router();

//media routes
mediaRouter.post("/upload", validate(controllers.media.upload.validation), controllers.media.upload.handler);

export default mediaRouter;
