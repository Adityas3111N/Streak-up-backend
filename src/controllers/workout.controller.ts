import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { error, success } from "../utils/response.util";
import { getWorkoutsForUserWeek, getWorkoutById, completeWorkout, getWorkoutStats, getWorkoutHistory as fetchWorkoutHistory} from "../services/workout.service";
import { updateProgressOnWorkout } from "../services/progress.service";
import { checkAndAwardBadges } from "../services/acheivement.service";
import User from "../models/user.model";

/**
 * Get workouts for current/specific week
 */
export const getWorkouts = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const user = await User.findById(userId);
        if (!user) return error(res, "User not found", 404);

        const weekNumber = parseInt(req.query.weekNumber as string) || user.currentWeek || 1;

        if (weekNumber < 1 || weekNumber > 12) {
            return error(res, "Invalid week number", 400);
        }

        const workouts = await getWorkoutsForUserWeek(userId, weekNumber);

        return success(res, {
            weekNumber,
            workouts
        });

    } catch (err: any) {
        console.error("Get workouts error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get workout detail
 */
export const getWorkoutDetail = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const workoutId = req.params.id || req.query.workoutId;
        if (!workoutId) return error(res, "Workout ID required", 400);

        const workout = await getWorkoutById(workoutId as string);
        if (!workout) {
            return error(res, "Workout not found", 404);
        }

        return success(res, {
            workout
        });

    } catch (err: any) {
        console.error("Get workout detail error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Complete workout
 */
export const completeWorkoutHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const { workoutId, exercisesCompleted, notes } = req.body;

        if (!workoutId || !exercisesCompleted || exercisesCompleted.length === 0) {
            return error(res, "Workout ID and exercises completed are required", 400);
        }

        // Log workout
        const workoutLog = await completeWorkout(userId, workoutId, exercisesCompleted, notes);

        // Update progress
        await updateProgressOnWorkout(userId);

        // Check for achievements
        await checkAndAwardBadges(userId);

        return success(res, {
            message: "Workout completed successfully",
            workoutLog
        }, 201);

    } catch (err: any) {
        console.error("Complete workout error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get workout history
 */
export const getWorkoutHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const limit = parseInt(req.query.limit as string) || 50;
        const history = await fetchWorkoutHistory(userId, limit);

        return success(res, {
            history,
            count: history.length
        });

    } catch (err: any) {
        console.error("Get workout history error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get workout stats
 */
export const getWorkoutStatsHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const stats = await getWorkoutStats(userId);

        return success(res, {
            stats
        });

    } catch (err: any) {
        console.error("Get workout stats error:", err);
        return error(res, "Server error", 500);
    }
};