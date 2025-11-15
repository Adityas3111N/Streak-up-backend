import { Document } from "mongoose";

export interface OnboardingAnswer {
    questionId: string;
    answer: string | number | boolean | string[];
}

export interface WorkoutExercise {
    name: string;
    sets: number;
    reps: number;
    rest: number; // seconds
    gifUrl?: string;
    notes?: string;
}

export interface WeeklyPlan {
    weekNumber: number;
    workouts: string[]; // Array of Workout IDs
    meals: string[]; // Array of Meal IDs
    status: 'locked' | 'unlocked' | 'completed';
    startDate?: Date;
    endDate?: Date;
}

export interface ProgressStats {
    currentStreak: number;
    longestStreak: number;
    totalWorkoutsCompleted: number;
    totalMealsLogged: number;
    weeklyCompletionRate: Record<string, number>; // weekNumber -> completion percentage
    lastActiveDate: Date;
}

export interface AchievementBadge {
    badgeId: string;
    badgeType: 'streak' | 'milestone' | 'week' | 'workout' | 'meal';
    name: string;
    description: string;
    iconUrl?: string;
}