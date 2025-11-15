import { Router } from "express";
import { getWorkouts, getWorkoutDetail, completeWorkoutHandler, getWorkoutHistory, getWorkoutStatsHandler } from "../../controllers/workout.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { getWorkoutsSchema, completeWorkoutSchema } from "../../validators/tracking.validator";

const router = Router();

router.get("/", isAuthenticated, validate(getWorkoutsSchema), getWorkouts);
// Specific routes MUST come before parameterized routes
router.post("/complete", isAuthenticated, validate(completeWorkoutSchema), completeWorkoutHandler);
router.get("/history/all", isAuthenticated, getWorkoutHistory);
router.get("/stats/overview", isAuthenticated, getWorkoutStatsHandler);
// Parameterized route comes LAST
router.get("/:id", isAuthenticated, getWorkoutDetail);

export default router;