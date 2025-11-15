import Progress, { ProgressInterface } from "../models/progress.model";
import WorkoutLog from "../models/workoutLog.model";
import MealLog from "../models/mealLog.model";
import { wasActiveToday, isSameDay } from "../utils/date.util";

/**
 * Get or create progress record for user
 */
export const getOrCreateProgress = async (userId: string): Promise<ProgressInterface> => {
    let progress = await Progress.findOne({ userId });
    
    if (!progress) {
        progress = await Progress.create({
            userId,
            currentStreak: 0,
            longestStreak: 0,
            totalWorkoutsCompleted: 0,
            totalMealsLogged: 0,
            weeklyCompletionRate: {},
            lastActiveDate: new Date()
        });
    }
    
    return progress;
};

/**
 * Update progress when workout is completed
 */
export const updateProgressOnWorkout = async (userId: string): Promise<void> => {
    const progress = await getOrCreateProgress(userId);
    const today = new Date();
    
    // Update totals
    progress.totalWorkoutsCompleted += 1;
    
    // Update streak
    await updateStreak(progress, today);
    
    await progress.save();
};

/**
 * Update progress when meal is logged
 */
export const updateProgressOnMeal = async (userId: string): Promise<void> => {
    const progress = await getOrCreateProgress(userId);
    const today = new Date();
    
    // Update totals
    progress.totalMealsLogged += 1;
    
    // Update streak
    await updateStreak(progress, today);
    
    await progress.save();
};

/**
 * Calculate and update streak
 */
const updateStreak = async (progress: ProgressInterface, activityDate: Date): Promise<void> => {
    const wasActive = wasActiveToday(progress.lastActiveDate);
    const isToday = isSameDay(activityDate, new Date());
    
    if (isToday && !wasActive) {
        // First activity today - check if we should continue or start streak
        const yesterday = new Date(activityDate);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (isSameDay(progress.lastActiveDate, yesterday)) {
            // Continued from yesterday
            progress.currentStreak += 1;
        } else {
            // New streak started
            progress.currentStreak = 1;
        }
        
        // Update longest streak if needed
        if (progress.currentStreak > progress.longestStreak) {
            progress.longestStreak = progress.currentStreak;
        }
        
        progress.lastActiveDate = activityDate;
    }
};

/**
 * Recalculate streak from scratch (for data integrity)
 */
export const recalculateStreak = async (userId: string): Promise<ProgressInterface> => {
    const progress = await getOrCreateProgress(userId);
    
    // Get all workout and meal logs, sorted by date
    const workoutLogs = await WorkoutLog.find({ userId })
        .sort({ completedAt: 1 })
        .select('completedAt')
        .lean();
    
    const mealLogs = await MealLog.find({ userId, skipped: false })
        .sort({ completedAt: 1 })
        .select('completedAt')
        .lean();
    
    // Combine and get unique active dates
    const activeDates = new Set<string>();
    
    [...workoutLogs, ...mealLogs].forEach(log => {
        const date = new Date(log.completedAt);
        date.setHours(0, 0, 0, 0);
        activeDates.add(date.toISOString().split('T')[0]);
    });
    
    // Calculate current streak (from today backwards)
    const sortedDates = Array.from(activeDates).sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;
    
    for (const dateStr of sortedDates) {
        const date = new Date(dateStr);
        
        if (!lastDate) {
            lastDate = date;
            tempStreak = 1;
            currentStreak = 1;
        } else {
            const daysDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                // Consecutive day
                tempStreak += 1;
                if (tempStreak === currentStreak + 1) {
                    currentStreak = tempStreak;
                }
            } else {
                // Gap found
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
                tempStreak = 1;
            }
            
            lastDate = date;
        }
    }
    
    if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
    }
    
    // Update progress
    progress.currentStreak = currentStreak;
    progress.longestStreak = longestStreak;
    
    if (sortedDates.length > 0) {
        progress.lastActiveDate = new Date(sortedDates[0]);
    }
    
    await progress.save();
    return progress;
};

/**
 * Update weekly completion rate
 */
export const updateWeeklyCompletion = async (
    userId: string,
    weekNumber: number,
    completionPercentage: number
): Promise<void> => {
    const progress = await getOrCreateProgress(userId);
    progress.weeklyCompletionRate[weekNumber.toString()] = completionPercentage;
    await progress.save();
};

/**
 * Get dashboard stats
 */
export const getDashboardStats = async (userId: string) => {
    const progress = await getOrCreateProgress(userId);
    
    return {
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        totalWorkoutsCompleted: progress.totalWorkoutsCompleted,
        totalMealsLogged: progress.totalMealsLogged,
        lastActiveDate: progress.lastActiveDate
    };
};

/**
 * Get weekly activity data for multiple weeks
 * Returns activity score per day (workouts * 2 + meals * 1)
 */
// ... existing code up to getDashboardStats ...

/**
 * Get weekly activity data for multiple weeks
 * Returns activity score per day (workouts * 2 + meals * 1)
 */
export const getWeeklyActivityData = async (
    userId: string,
    weeksBack: number = 3 // Get current week + 3 past weeks
) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate start date (weeksBack weeks ago, Monday)
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days to get to Monday
    const currentWeekMonday = new Date(today);
    currentWeekMonday.setDate(today.getDate() - daysToMonday);
    
    const startDate = new Date(currentWeekMonday);
    startDate.setDate(currentWeekMonday.getDate() - (weeksBack * 7));
    
    // Get all workout logs from start date
    const workoutLogs = await WorkoutLog.find({
        userId,
        completedAt: { $gte: startDate }
    })
    .populate('workoutId', 'duration')
    .sort({ completedAt: 1 })
    .lean();
    
    // Get all meal logs from start date
    const mealLogs = await MealLog.find({
        userId,
        completedAt: { $gte: startDate },
        skipped: false
    })
    .sort({ completedAt: 1 })
    .lean();
    
    // Group by week and day - fix type definition
    const weeklyData: Record<string, {
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
        sunday: number;
    }> = {};
    
    // Process workout logs
    workoutLogs.forEach(log => {
        const logDate = new Date(log.completedAt);
        const weekKey = getWeekKey(logDate);
        const dayKey = getDayKey(logDate);
        
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0
            };
        }
        
        // Activity score: workouts count as 2 points
        weeklyData[weekKey][dayKey] += 2;
    });
    
    // Process meal logs
    mealLogs.forEach(log => {
        const logDate = new Date(log.completedAt);
        const weekKey = getWeekKey(logDate);
        const dayKey = getDayKey(logDate);
        
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0
            };
        }
        
        // Activity score: meals count as 1 point
        weeklyData[weekKey][dayKey] += 1;
    });
    
    // Format response
    const formattedData: Array<{
        weekNumber: number;
        weekStart: string;
        weekEnd: string;
        days: {
            monday: number;
            tuesday: number;
            wednesday: number;
            thursday: number;
            friday: number;
            saturday: number;
            sunday: number;
        };
    }> = [];
    
    // Generate data for each week
    for (let i = weeksBack; i >= 0; i--) {
        const weekStart = new Date(currentWeekMonday);
        weekStart.setDate(currentWeekMonday.getDate() - (i * 7));
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekKey = getWeekKey(weekStart);
        const weekData = weeklyData[weekKey] || {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0
        };
        
        formattedData.push({
            weekNumber: weeksBack - i + 1, // 1 = current week, 2 = 1 week ago, etc.
            weekStart: weekStart.toISOString().split('T')[0],
            weekEnd: weekEnd.toISOString().split('T')[0],
            days: weekData
        });
    }
    
    return formattedData;
};

// Helper functions
function getWeekKey(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dayOfWeek = d.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(d);
    monday.setDate(d.getDate() - daysToMonday);
    return monday.toISOString().split('T')[0];
}

function getDayKey(date: Date): 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' {
    const days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];
    return days[date.getDay()];
}