// server/index.js
import "dotenv/config";
import { writeFile } from "fs/promises";
import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import { v2 as cloudinary } from "cloudinary";
import upload from "express-fileupload";
import swaggerSpec from "./swagger/specs.js";
import { handleError } from "./utils/handlers.js";
import rootRouter from "./routes/v1.js";
import { UPLOADS_DIR } from "./utils/mediaStorage.js";

import "./cron/index.js";
import "./utils/firebase.js";

import { MAX_FILE_SIZE } from "./utils/constants.js";
import creditLeaves from "./cron/creditLeaves.js";
import generateMonthlyPayroll from "./cron/generateMonthlyPayroll.js";
import { sendNotification } from "./utils/firebase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const firebaseConfig = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key?.replace(/\\n/g, "\n"),
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain,
};

writeFile(path.join(__dirname, "firebase.json"), JSON.stringify(firebaseConfig, null, 2));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//cors
app.use(cors("*"));

//body-parser
app.use(express.json());

//url-encoded
app.use(express.urlencoded({ extended: false }));

//logger
app.use(logger("dev"));

// Serve static frontend
app.use(express.static(path.resolve(__dirname, "../dist")));

// Serve locally-stored uploads (used as the fallback when Cloudinary isn't configured)
app.use("/uploads", express.static(UPLOADS_DIR));

//fileUpload
app.use(upload({ useTempFiles: true, tempFileDir: path.resolve(__dirname, "../dist"), safeFileNames: true, preserveExtension: 4, limits: { fileSize: MAX_FILE_SIZE } }));

//apis
app.use(`/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", rootRouter);
app.use("/api/*splat", (_, res) => handleError(res, "Not Found", "Not Found"));

// Fallback for SPA
app.get("/{*splat}", (req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(404).send("Not Found");
  } else {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
  }
});

const startServer = async () => {
  app.listen(process.env.PORT, () => console.log(`🚀 Server ready at https://ezulixmacbookpro.ddns.net:3000/`));
  creditLeaves();
  generateMonthlyPayroll();
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔌 Connected to MongoDB");
    startServer();
  })
  .catch((err) => console.error("❌ Error connecting to MongoDB", err));
