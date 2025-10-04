import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";

import { serverStatusCheck } from "./routes/serverStatusRoute.js";
import { handleDataAnalysis, handleFileUpload } from "./routes/uploadRoute.js";
import { getReportById, listReports } from "./routes/reportRoute.js";

dotenv.config();
const CONFIG = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGO_URI,
  MAX_FILE_SIZE: Number(process.env.MAX_FILE_BYTES) || 5 * 1024 * 1024,
};

const app = express();
const uploadMiddleware = multer({
  limits: { fileSize: CONFIG.MAX_FILE_SIZE },
});

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/serverStatus", serverStatusCheck);
app.post("/upload", uploadMiddleware.single("file"), handleFileUpload);
app.post("/analyze", handleDataAnalysis);
app.get("/report/:reportId", getReportById);
app.get("/reports", listReports);

const startServer = async () => {
  try {
    await mongoose.connect(CONFIG.MONGODB_URI, { autoIndex: true });
    app.listen(CONFIG.PORT, () => {
      console.log(`Server listening on port ${CONFIG.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
