import { OnboardingAnswer } from "../types/plan.types";

/**
 * Determine workout frequency based on onboarding answers
 */
export const getWorkoutFrequency = (answers: OnboardingAnswer[]): number => {
    // Default: 3 workouts per week
    // Can be customized based on specific question answers
    const frequencyAnswer = answers.find(a => a.questionId === 'frequency' || a.questionId === 'workoutFrequency');
    if (frequencyAnswer && typeof frequencyAnswer.answer === 'number') {
        return frequencyAnswer.answer;
    }
    return 3; // Default
};

/**
 * Determine workout duration based on week number
 */
export const getWorkoutDuration = (weekNumber: number): number => {
    // Week 1-2: 15 minutes
    // Week 3-4: 20 minutes
    // Week 5-7: 25 minutes
    // Week 8-12: 30 minutes
    if (weekNumber <= 2) return 15;
    if (weekNumber <= 4) return 20;
    if (weekNumber <= 7) return 25;
    return 30;
};

/**
 * Determine workout difficulty based on week number
 */
export const getWorkoutDifficulty = (weekNumber: number): 'beginner' | 'intermediate' | 'advanced' => {
    if (weekNumber <= 3) return 'beginner';
    if (weekNumber <= 7) return 'intermediate';
    return 'advanced';
};

/**
 * Determine workout days based on frequency
 */
export const getWorkoutDays = (frequency: number): number[] => {
    // Distribute workouts evenly across the week
    // 3x/week: Monday, Wednesday, Friday (1, 3, 5)
    // 4x/week: Monday, Tuesday, Thursday, Saturday (1, 2, 4, 6)
    // 5x/week: Monday-Friday (1-5)
    if (frequency === 3) return [1, 3, 5];
    if (frequency === 4) return [1, 2, 4, 6];
    if (frequency === 5) return [1, 2, 3, 4, 5];
    // Default to 3x/week
    return [1, 3, 5];
};

/**
 * Calculate completion percentage for a week
 */
export const calculateWeekCompletion = (
    totalWorkouts: number,
    completedWorkouts: number,
    totalMeals: number,
    loggedMeals: number
): number => {
    const workoutWeight = 0.6; // Workouts are 60% of completion
    const mealWeight = 0.4; // Meals are 40% of completion
    
    const workoutCompletion = totalWorkouts > 0 
        ? (completedWorkouts / totalWorkouts) * 100 
        : 0;
    
    const mealCompletion = totalMeals > 0 
        ? (loggedMeals / totalMeals) * 100 
        : 0;
    
    return Math.round((workoutCompletion * workoutWeight) + (mealCompletion * mealWeight));
};

/**
 * Check if week should be unlocked (80%+ completion)
 */
export const shouldUnlockNextWeek = (completionPercentage: number): boolean => {
    return completionPercentage >= 80;
};