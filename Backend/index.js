import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { serverStatusCheck } from "./routes/serverStatusRoute.js";

dotenv.config();
const CONFIG = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGO_URI,
};

const app = express();

app.use(cors());

app.get("/serverStatus", serverStatusCheck);

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
