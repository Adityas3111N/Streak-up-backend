import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { error, success } from "../utils/response.util";
import UserPlan from "../models/userPlan.model";
import User from "../models/user.model";
import { calculateWeekCompletion, shouldUnlockNextWeek } from "../utils/planLogic.util";
import { generatePlan } from "../services/planGeneration.service";
import WorkoutLog from "../models/workoutLog.model";
import MealLog from "../models/mealLog.model";
import { updateWeeklyCompletion } from "../services/progress.service";
import { checkAndAwardBadges } from "../services/acheivement.service";

/**
 * Generate personalized plan
 */
export const generateUserPlan = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        // Check if plan already exists
        const existingPlan = await UserPlan.findOne({ userId });
        if (existingPlan) {
            return error(res, "Plan already exists", 400);
        }

        await generatePlan(userId);

        return success(res, {
            message: "Plan generated successfully"
        }, 201);

    } catch (err: any) {
        console.error("Generate plan error:", err);
        return error(res, err.message || "Server error", 500);
    }
};

/**
 * Get current week's plan
 */
export const getCurrentWeek = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const user = await User.findById(userId);
        if (!user) return error(res, "User not found", 404);

        const weekNumber = user.currentWeek || 1;
        const plan = await UserPlan.findOne({ userId, weekNumber })
            .populate('workouts')
            .populate('meals')
            .lean();

        if (!plan) {
            return error(res, "Plan not found for current week", 404);
        }

        return success(res, {
            weekNumber,
            plan
        });

    } catch (err: any) {
        console.error("Get current week error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get specific week's plan
 */
export const getWeekPlan = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const weekNumber = parseInt(req.query.weekNumber as string) || req.body.weekNumber || 1;

        if (weekNumber < 1 || weekNumber > 12) {
            return error(res, "Invalid week number. Must be between 1 and 12", 400);
        }

        const plan = await UserPlan.findOne({ userId, weekNumber })
            .populate('workouts')
            .populate('meals')
            .lean();

        if (!plan) {
            return error(res, "Plan not found for this week", 404);
        }

        return success(res, {
            weekNumber,
            plan
        });

    } catch (err: any) {
        console.error("Get week plan error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get overview of all weeks
 */
export const getAllWeeks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const plans = await UserPlan.find({ userId })
            .sort({ weekNumber: 1 })
            .select('weekNumber status startDate endDate')
            .lean();

        return success(res, {
            weeks: plans
        });

    } catch (err: any) {
        console.error("Get all weeks error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Unlock next week (can be called manually or automatically)
 */
export const unlockNextWeek = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const user = await User.findById(userId);
        if (!user) return error(res, "User not found", 404);

        const currentWeek = user.currentWeek || 1;
        const nextWeek = currentWeek + 1;

        if (nextWeek > 12) {
            return error(res, "Already at maximum week", 400);
        }

        // Get current week plan
        const currentPlan = await UserPlan.findOne({ userId, weekNumber: currentWeek });
        if (!currentPlan) {
            return error(res, "Current week plan not found", 404);
        }

        // Calculate completion
        const completedWorkouts = await WorkoutLog.countDocuments({
            userId,
            workoutId: { $in: currentPlan.workouts }
        });

        const loggedMeals = await MealLog.countDocuments({
            userId,
            mealId: { $in: currentPlan.meals },
            skipped: false
        });

        const completionPercentage = calculateWeekCompletion(
            currentPlan.workouts.length,
            completedWorkouts,
            currentPlan.meals.length,
            loggedMeals
        );

        // Update weekly completion rate
        await updateWeeklyCompletion(userId, currentWeek, completionPercentage);

        // Check if should unlock
        if (!shouldUnlockNextWeek(completionPercentage)) {
            return error(res, `Week ${currentWeek} is only ${completionPercentage}% complete. Need 80% to unlock next week.`, 400);
        }

        // Unlock next week
        const nextPlan = await UserPlan.findOne({ userId, weekNumber: nextWeek });
        if (!nextPlan) {
            return error(res, "Next week plan not found", 404);
        }

        nextPlan.status = 'unlocked';
        await nextPlan.save();

        // Mark current week as completed if 100%
        if (completionPercentage === 100) {
            currentPlan.status = 'completed';
            await currentPlan.save();
        }

        // Update user's current week
        user.currentWeek = nextWeek;
        await user.save();

        // Check for achievements
        await checkAndAwardBadges(userId);

        return success(res, {
            message: `Week ${nextWeek} unlocked successfully`,
            currentWeek: nextWeek,
            previousWeekCompletion: completionPercentage
        });

    } catch (err: any) {
        console.error("Unlock next week error:", err);
        return error(res, "Server error", 500);
    }
};