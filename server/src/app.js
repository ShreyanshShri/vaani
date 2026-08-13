// app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import pushRoutes from "./routes/push.js";
import reminderRoutes from "./routes/reminder.js";
import prescriptionRouter from "./routes/prescription.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// Both DB drivers
import { connectDB } from "./config/db.js"; // Mongoose
import { connectMongo } from "./db/mongodb.js"; // Native MongoClient
// import { initQdrant } from "./memory/qdrant.js";
import { initializeMemoryCollection } from "./memory/init.js";
import { connectRedis } from "./config/redis.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/prescriptions", prescriptionRouter);
app.use("/api/push", pushRoutes);
app.use("/api/reminders", reminderRoutes);

// Initialize all database connections in parallel or sequence
app.ready = async () => {
	await Promise.all([
		connectDB(), // Connect Mongoose
		connectMongo(), // Connect MongoClient
		// initQdrant(), // Connect Vector DB
		initializeMemoryCollection(),
		connectRedis(), // Connect Redis
	]);
};

app.use(errorHandler);

export default app;
