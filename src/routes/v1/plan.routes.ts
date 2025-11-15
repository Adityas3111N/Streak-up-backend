import { Router } from "express";
import { generateUserPlan, getCurrentWeek, getWeekPlan, getAllWeeks, unlockNextWeek } from "../../controllers/plan.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { generatePlanSchema, getWeekPlanSchema, unlockNextWeekSchema } from "../../validators/plan.validator";

const router = Router();

router.post("/generate", isAuthenticated, validate(generatePlanSchema), generateUserPlan);
router.get("/current", isAuthenticated, getCurrentWeek);
router.get("/week", isAuthenticated, validate(getWeekPlanSchema), getWeekPlan);
router.get("/all", isAuthenticated, getAllWeeks);
router.post("/unlock", isAuthenticated, validate(unlockNextWeekSchema), unlockNextWeek);

export default router;