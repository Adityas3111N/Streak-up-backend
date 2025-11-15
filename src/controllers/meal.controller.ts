import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { error, success } from "../utils/response.util";
import { getMealsForUserWeek, getMealsForDay, getMealById, logMeal, getMealHistory as fetchMealHistory, getMealStats } from "../services/meal.service";
import { updateProgressOnMeal } from "../services/progress.service";
import { checkAndAwardBadges } from "../services/acheivement.service";
import User from "../models/user.model";

/**
 * Get meals for current/specific week
 */
export const getMeals = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const user = await User.findById(userId);
        if (!user) return error(res, "User not found", 404);

        const weekNumber = parseInt(req.query.weekNumber as string) || user.currentWeek || 1;
        const day = req.query.day ? parseInt(req.query.day as string) : undefined;

        if (weekNumber < 1 || weekNumber > 12) {
            return error(res, "Invalid week number", 400);
        }

        let meals;
        if (day) {
            meals = await getMealsForDay(weekNumber, day);
        } else {
            meals = await getMealsForUserWeek(userId, weekNumber);
        }

        return success(res, {
            weekNumber,
            day,
            meals
        });

    } catch (err: any) {
        console.error("Get meals error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get meal detail
 */
export const getMealDetail = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const mealId = req.params.id || req.query.mealId;
        if (!mealId) return error(res, "Meal ID required", 400);

        const meal = await getMealById(mealId as string);
        if (!meal) {
            return error(res, "Meal not found", 404);
        }

        return success(res, {
            meal
        });

    } catch (err: any) {
        console.error("Get meal detail error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Log meal
 */
export const logMealHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const { mealId, skipped } = req.body;

        if (!mealId) {
            return error(res, "Meal ID required", 400);
        }

        // Log meal
        const mealLog = await logMeal(userId, mealId, skipped || false);

        // Update progress (only if not skipped)
        if (!skipped) {
            await updateProgressOnMeal(userId);
        }

        // Check for achievements
        await checkAndAwardBadges(userId);

        return success(res, {
            message: skipped ? "Meal skipped" : "Meal logged successfully",
            mealLog
        }, 201);

    } catch (err: any) {
        console.error("Log meal error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Skip meal (alias for logMeal with skipped=true)
 */
export const skipMeal = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const { mealId } = req.body;

        if (!mealId) {
            return error(res, "Meal ID required", 400);
        }

        const mealLog = await logMeal(userId, mealId, true);

        return success(res, {
            message: "Meal skipped",
            mealLog
        }, 201);

    } catch (err: any) {
        console.error("Skip meal error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get meal history
 */
export const getMealHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const limit = parseInt(req.query.limit as string) || 100;
        const history = await fetchMealHistory(userId, limit);

        return success(res, {
            history,
            count: history.length
        });

    } catch (err: any) {
        console.error("Get meal history error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get meal stats
 */
export const getMealStatsHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const stats = await getMealStats(userId);

        return success(res, {
            stats
        });

    } catch (err: any) {
        console.error("Get meal stats error:", err);
        return error(res, "Server error", 500);
    }
};