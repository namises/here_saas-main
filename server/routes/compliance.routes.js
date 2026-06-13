import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
import { makeCrudRouter } from "../utils/crudController.js";

export default makeCrudRouter(express, validate, controllers.compliance, (router) => {
  router.get("/stats", validate(controllers.compliance.stats.validation), controllers.compliance.stats.handler);
});
