import express from "express";
import { validate } from "../middlewares/validator.js";
import controllers from "../controllers/index.js";
import { makeCrudRouter } from "../utils/crudController.js";

export default makeCrudRouter(express, validate, controllers.biometric);
