import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { CORS_ORIGIN } from "./config/env.config";

const app = express();

//middlewares

// app.use(cors(
//     {
//         origin: CORS_ORIGIN,
//         credentials: true
//     }
// ));

app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "10kb", extended: true }));
app.use(cookieParser());

// Routes
import authRoutes from "./routes/v1/auth.routes"
import onboardingRoutes from "./routes/v1/onboarding.routes";
import planRoutes from "./routes/v1/plan.routes";
import workoutRoutes from "./routes/v1/workout.routes";
import mealRoutes from "./routes/v1/meal.routes";
import progressRoutes from "./routes/v1/progress.routes";
import achievementRoutes from "./routes/v1/achievement.routes";
import healthRoutes from "./routes/v1/health.routes";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/onboarding", onboardingRoutes);
app.use("/api/v1/plan", planRoutes);
app.use("/api/v1/workout", workoutRoutes);
app.use("/api/v1/meal", mealRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/achievement", achievementRoutes);
app.use("/api/v1/health", healthRoutes);

// Global Error Middleware (must be after routes)
app.use(errorHandler);

export default app;