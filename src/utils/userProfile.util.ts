import { OnboardingAnswer } from "../types/plan.types";

export interface UserProfile {
    // Fitness
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    workoutFrequency: number; // 3, 4, or 5
    workoutDuration: number; // preferred duration
    workoutGoals: string[]; // ['weight_loss', 'strength', 'endurance', 'flexibility', 'muscle_gain']
    equipment: 'none' | 'home' | 'gym'; // available equipment
    injuries: string[]; // any injuries/limitations
    
    // Lifestyle
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
    scheduleType: 'morning' | 'afternoon' | 'evening' | 'flexible';
    workoutPreference: 'indoor' | 'outdoor' | 'both';
    
    // Nutrition
    dietaryRestrictions: string[]; // ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto', 'paleo']
    mealPrepTime: 'quick' | 'moderate' | 'elaborate';
    cuisinePreferences: string[]; // ['mediterranean', 'asian', 'mexican', 'american']
    cookingSkill: 'beginner' | 'intermediate' | 'advanced';
    
    // Personal
    age: number;
    gender: 'male' | 'female' | 'other';
    currentWeight?: number;
    targetWeight?: number;
    primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'fitness';
}

/**
 * Extract user profile from onboarding answers
 */
export const extractUserProfile = (answers: OnboardingAnswer[]): UserProfile => {
    const getAnswer = (questionId: string, defaultValue: any = null) => {
        const answer = answers.find(a => a.questionId === questionId);
        return answer?.answer ?? defaultValue;
    };

    // Helper to ensure array type
    const getArrayAnswer = (questionId: string, defaultValue: any[] = []): any[] => {
        const answer = getAnswer(questionId, defaultValue);
        return Array.isArray(answer) ? answer : defaultValue;
    };

    // Helper to ensure string type
    const getStringAnswer = (questionId: string, defaultValue: string): string => {
        const answer = getAnswer(questionId, defaultValue);
        return typeof answer === 'string' ? answer : defaultValue;
    };

    // Helper to ensure number type
    const getNumberAnswer = (questionId: string, defaultValue: number): number => {
        const answer = getAnswer(questionId, defaultValue);
        const parsed = typeof answer === 'number' ? answer : parseInt(String(answer || defaultValue));
        return isNaN(parsed) ? defaultValue : parsed;
    };

    return {
        // Fitness
        fitnessLevel: (getStringAnswer('fitnessLevel', 'beginner') as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        workoutFrequency: getNumberAnswer('workoutFrequency', 3),
        workoutDuration: getNumberAnswer('workoutDuration', 20),
        workoutGoals: getArrayAnswer('workoutGoals', []),
        equipment: (getStringAnswer('equipment', 'none') as 'none' | 'home' | 'gym') || 'none',
        injuries: getArrayAnswer('injuries', []),
        
        // Lifestyle
        activityLevel: (getStringAnswer('activityLevel', 'lightly_active') as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active') || 'lightly_active',
        scheduleType: (getStringAnswer('scheduleType', 'flexible') as 'morning' | 'afternoon' | 'evening' | 'flexible') || 'flexible',
        workoutPreference: (getStringAnswer('workoutPreference', 'both') as 'indoor' | 'outdoor' | 'both') || 'both',
        
        // Nutrition
        dietaryRestrictions: getArrayAnswer('dietaryRestrictions', []),
        mealPrepTime: (getStringAnswer('mealPrepTime', 'moderate') as 'quick' | 'moderate' | 'elaborate') || 'moderate',
        cuisinePreferences: getArrayAnswer('cuisinePreferences', []),
        cookingSkill: (getStringAnswer('cookingSkill', 'intermediate') as 'beginner' | 'intermediate' | 'advanced') || 'intermediate',
        
        // Personal
        age: getNumberAnswer('age', 25),
        gender: (getStringAnswer('gender', 'other') as 'male' | 'female' | 'other') || 'other',
        currentWeight: (() => {
            const weight = getAnswer('currentWeight', 0);
            const parsed = typeof weight === 'number' ? weight : parseFloat(String(weight || 0));
            return isNaN(parsed) || parsed === 0 ? undefined : parsed;
        })(),
        targetWeight: (() => {
            const weight = getAnswer('targetWeight', 0);
            const parsed = typeof weight === 'number' ? weight : parseFloat(String(weight || 0));
            return isNaN(parsed) || parsed === 0 ? undefined : parsed;
        })(),
        primaryGoal: (getStringAnswer('primaryGoal', 'fitness') as 'weight_loss' | 'muscle_gain' | 'maintenance' | 'fitness') || 'fitness'
    };
};

/**
 * Create a deterministic seed from userId for consistent randomization
 */
export const createUserSeed = (userId: string): number => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

/**
 * Seeded random number generator (same seed = same sequence)
 */
export class SeededRandom {
    private seed: number;
    
    constructor(seed: number) {
        this.seed = seed;
    }
    
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    
    random(min: number = 0, max: number = 1): number {
        return min + (max - min) * this.next();
    }
    
    randomInt(min: number, max: number): number {
        return Math.floor(this.random(min, max + 1));
    }
    
    shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    choice<T>(array: T[]): T {
        return array[Math.floor(this.next() * array.length)];
    }
}