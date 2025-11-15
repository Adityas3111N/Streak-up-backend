import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { error, success } from "../utils/response.util";
import { getDashboardStats, getOrCreateProgress, getWeeklyActivityData } from "../services/progress.service";
import { daysUntilGoal } from "../utils/date.util";
import User from "../models/user.model";
import WorkoutLog from "../models/workoutLog.model";
import MealLog from "../models/mealLog.model";

/**
 * Get dashboard stats (home screen)
 */
export const getDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const user = await User.findById(userId);
        if (!user) return error(res, "User not found", 404);

        const progress = await getOrCreateProgress(userId);
        const stats = await getDashboardStats(userId);

        // Calculate days until goal
        let daysUntilGoalDate = null;
        if (user.goalDate) {
            daysUntilGoalDate = daysUntilGoal(user.goalDate);
        }

        return success(res, {
            currentStreak: stats.currentStreak,
            longestStreak: stats.longestStreak,
            totalWorkoutsCompleted: stats.totalWorkoutsCompleted,
            totalMealsLogged: stats.totalMealsLogged,
            daysUntilGoal: daysUntilGoalDate,
            currentWeek: user.currentWeek || 1,
            lastActiveDate: stats.lastActiveDate
        });

    } catch (err: any) {
        console.error("Get dashboard error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get detailed progress stats
 */
export const getProgressStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const progress = await getOrCreateProgress(userId);

        return success(res, {
            currentStreak: progress.currentStreak,
            longestStreak: progress.longestStreak,
            totalWorkoutsCompleted: progress.totalWorkoutsCompleted,
            totalMealsLogged: progress.totalMealsLogged,
            weeklyCompletionRate: progress.weeklyCompletionRate,
            lastActiveDate: progress.lastActiveDate
        });

    } catch (err: any) {
        console.error("Get progress stats error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get streak calendar data
 */
export const getStreakCalendar = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        // Get all workout and meal logs
        const workoutLogs = await WorkoutLog.find({ userId })
            .select('completedAt')
            .lean();

        const mealLogs = await MealLog.find({ userId, skipped: false })
            .select('completedAt')
            .lean();

        // Combine and get unique active dates
        const activeDates = new Set<string>();

        [...workoutLogs, ...mealLogs].forEach(log => {
            const date = new Date(log.completedAt);
            date.setHours(0, 0, 0, 0);
            activeDates.add(date.toISOString().split('T')[0]);
        });

        return success(res, {
            activeDates: Array.from(activeDates).sort()
        });

    } catch (err: any) {
        console.error("Get streak calendar error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get weekly completion chart data
 */
export const getWeeklyCompletion = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const progress = await getOrCreateProgress(userId);

        return success(res, {
            weeklyCompletionRate: progress.weeklyCompletionRate
        });

    } catch (err: any) {
        console.error("Get weekly completion error:", err);
        return error(res, "Server error", 500);
    }
};

/**
 * Get weekly activity data for multiple weeks
 */
export const getWeeklyActivity = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const weeksBack = parseInt(req.query.weeksBack as string) || 3;
        
        if (weeksBack < 0 || weeksBack > 12) {
            return error(res, "weeksBack must be between 0 and 12", 400);
        }

        const weeklyData = await getWeeklyActivityData(userId, weeksBack);

        return success(res, {
            weeklyActivity: weeklyData,
            currentWeek: weeklyData[0] // First item is current week
        });

    } catch (err: any) {
        console.error("Get weekly activity error:", err);
        return error(res, "Server error", 500);
    }
};