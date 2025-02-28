import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => logger.error(`MongoDB connection error: ${err.message}`));

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
