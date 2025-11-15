import { Router } from "express";
import { getMeals, getMealDetail, logMealHandler, skipMeal, getMealHistory, getMealStatsHandler } from "../../controllers/meal.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { getMealsSchema, logMealSchema, skipMealSchema } from "../../validators/tracking.validator";

const router = Router();

router.get("/", isAuthenticated, validate(getMealsSchema), getMeals);
router.post("/log", isAuthenticated, validate(logMealSchema), logMealHandler);
router.post("/skip", isAuthenticated, validate(skipMealSchema), skipMeal);
router.get("/history/all", isAuthenticated, getMealHistory);
router.get("/stats/overview", isAuthenticated, getMealStatsHandler);

// Always keep this LAST
router.get("/:id", isAuthenticated, getMealDetail);



export default router;