import { Router } from "express";
import { getAchievements, getAvailableBadges } from "../../controllers/achievement.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, getAchievements);
router.get("/available", isAuthenticated, getAvailableBadges);

export default router;