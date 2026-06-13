import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
import { makeCrudRouter } from "../utils/crudController.js";

export default makeCrudRouter(express, validate, controllers.wps, (router) => {
  router.post("/generate", validate(controllers.wps.generate.validation), controllers.wps.generate.handler);
  router.get("/download", validate(controllers.wps.download.validation), controllers.wps.download.handler);
});
