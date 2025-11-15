import Workout from "../models/workout.model";
import WorkoutLog from "../models/workoutLog.model";
import UserPlan from "../models/userPlan.model";

/**
 * Get workouts for a specific week
 */
export const getWorkoutsForWeek = async (weekNumber: number) => {
    return await Workout.find({ weekNumber }).sort({ day: 1 }).lean();
};

/**
 * Get workout detail by ID
 */
export const getWorkoutById = async (workoutId: string) => {
    return await Workout.findById(workoutId).lean();
};

/**
 * Get workouts for user's current week
 */
export const getWorkoutsForUserWeek = async (userId: string, weekNumber: number) => {
    const userPlan = await UserPlan.findOne({ userId, weekNumber }).populate('workouts');
    
    if (!userPlan) {
        return [];
    }
    
    return userPlan.workouts;
};

/**
 * Complete a workout
 */
export const completeWorkout = async (
    userId: string,
    workoutId: string,
    exercisesCompleted: Array<{ exerciseName: string; setsCompleted: number; repsCompleted: number }>,
    notes?: string
) => {
    const workoutLog = await WorkoutLog.create({
        userId,
        workoutId,
        exercisesCompleted,
        notes,
        completedAt: new Date()
    });
    
    return workoutLog;
};

/**
 * Get workout history for user
 */
export const getWorkoutHistory = async (userId: string, limit: number = 50) => {
    return await WorkoutLog.find({ userId })
        .populate('workoutId')
        .sort({ completedAt: -1 })
        .limit(limit)
        .lean();
};

/**
 * Get workout statistics for user
 */
export const getWorkoutStats = async (userId: string) => {
    const totalCompleted = await WorkoutLog.countDocuments({ userId });
    
    const logs = await WorkoutLog.find({ userId })
        .select('completedAt')
        .lean();
    
    // Count workouts by week
    const workoutsByWeek: Record<string, number> = {};
    logs.forEach(log => {
        const date = new Date(log.completedAt);
        // Simple week calculation (can be improved)
        const week = Math.ceil(date.getDate() / 7);
        workoutsByWeek[week] = (workoutsByWeek[week] || 0) + 1;
    });
    
    return {
        totalCompleted,
        workoutsByWeek
    };
};