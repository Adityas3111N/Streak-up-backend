import Meal from "../models/meal.model";
import MealLog from "../models/mealLog.model";
import UserPlan from "../models/userPlan.model";

/**
 * Get meals for a specific week
 */
export const getMealsForWeek = async (weekNumber: number) => {
    return await Meal.find({ weekNumber }).sort({ day: 1, mealType: 1 }).lean();
};

/**
 * Get meals for a specific day in a week
 */
export const getMealsForDay = async (weekNumber: number, day: number) => {
    return await Meal.find({ weekNumber, day }).sort({ mealType: 1 }).lean();
};

/**
 * Get meal detail by ID
 */
export const getMealById = async (mealId: string) => {
    return await Meal.findById(mealId).lean();
};

/**
 * Get meals for user's current week
 */
export const getMealsForUserWeek = async (userId: string, weekNumber: number) => {
    const userPlan = await UserPlan.findOne({ userId, weekNumber }).populate('meals');
    
    if (!userPlan) {
        return [];
    }
    
    return userPlan.meals;
};

/**
 * Log a meal
 */
export const logMeal = async (userId: string, mealId: string, skipped: boolean = false) => {
    const mealLog = await MealLog.create({
        userId,
        mealId,
        skipped,
        completedAt: new Date()
    });
    
    return mealLog;
};

/**
 * Get meal history for user
 */
export const getMealHistory = async (userId: string, limit: number = 100) => {
    return await MealLog.find({ userId })
        .populate('mealId')
        .sort({ completedAt: -1 })
        .limit(limit)
        .lean();
};

/**
 * Get meal statistics for user
 */
export const getMealStats = async (userId: string) => {
    const totalLogged = await MealLog.countDocuments({ userId, skipped: false });
    const totalSkipped = await MealLog.countDocuments({ userId, skipped: true });
    
    return {
        totalLogged,
        totalSkipped,
        completionRate: totalLogged + totalSkipped > 0 
            ? Math.round((totalLogged / (totalLogged + totalSkipped)) * 100) 
            : 0
    };
};