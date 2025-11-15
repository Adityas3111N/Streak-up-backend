/**
 * Calculate days until goal date from today
 */
export const daysUntilGoal = (goalDate: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const goal = new Date(goalDate);
    goal.setHours(0, 0, 0, 0);
    
    const diffTime = goal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
};

/**
 * Calculate current week number based on plan start date
 */
export const getCurrentWeekNumber = (startDate: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;
    
    return Math.min(Math.max(weekNumber, 1), 12); // Clamp between 1 and 12
};

/**
 * Check if user was active today (logged workout or meal)
 */
export const wasActiveToday = (lastActiveDate: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    
    return lastActive.getTime() === today.getTime();
};

/**
 * Check if two dates are on the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);
    
    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);
    
    return d1.getTime() === d2.getTime();
};

/**
 * Get start and end dates for a week number (0-based from start date)
 */
export const getWeekDates = (startDate: Date, weekNumber: number): { start: Date; end: Date } => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + (weekNumber - 1) * 7);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { start: weekStart, end: weekEnd };
};