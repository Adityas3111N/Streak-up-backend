import { Router } from "express";
import { getDashboard, getProgressStats, getStreakCalendar, getWeeklyCompletion, getWeeklyActivity } from "../../controllers/progress.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/dashboard", isAuthenticated, getDashboard);
router.get("/stats", isAuthenticated, getProgressStats);
router.get("/calendar", isAuthenticated, getStreakCalendar);
router.get("/weekly", isAuthenticated, getWeeklyCompletion);
router.get("/weekly-activity", isAuthenticated, getWeeklyActivity);

export default router;