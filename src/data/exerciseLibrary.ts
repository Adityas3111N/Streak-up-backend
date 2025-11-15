import { WorkoutExercise } from "../types/plan.types";

export interface ExerciseDefinition extends WorkoutExercise {
    equipment: 'none' | 'home' | 'gym';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    targetMuscles: string[]; // ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio']
    workoutType: 'strength' | 'cardio' | 'flexibility' | 'mixed';
    impactLevel: 'low' | 'medium' | 'high'; // for injury consideration
    goals: string[]; // ['weight_loss', 'strength', 'endurance', 'flexibility', 'muscle_gain']
    alternatives?: string[]; // alternative exercises if this one doesn't match
}

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
    // BEGINNER - NO EQUIPMENT
    {
        name: 'Wall Push-ups',
        sets: 3,
        reps: 10,
        rest: 60,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['chest', 'arms'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'weight_loss'],
        gifUrl: ''
    },
    {
        name: 'Assisted Squats',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['legs', 'glutes'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'weight_loss'],
        gifUrl: ''
    },
    {
        name: 'Knee Plank Hold',
        sets: 3,
        reps: 20,
        rest: 45,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['core'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'flexibility'],
        gifUrl: ''
    },
    {
        name: 'Glute Bridge',
        sets: 3,
        reps: 12,
        rest: 45,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['glutes', 'legs'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'flexibility'],
        gifUrl: ''
    },
    {
        name: 'Marching in Place',
        sets: 2,
        reps: 30,
        rest: 30,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['cardio'],
        workoutType: 'cardio',
        impactLevel: 'low',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Standing Shoulder Press',
        sets: 3,
        reps: 10,
        rest: 45,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['shoulders', 'arms'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Seated Leg Raises',
        sets: 3,
        reps: 10,
        rest: 45,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['legs', 'core'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'flexibility'],
        gifUrl: ''
    },
    {
        name: 'Cat-Cow Stretch',
        sets: 2,
        reps: 10,
        rest: 30,
        equipment: 'none',
        difficulty: 'beginner',
        targetMuscles: ['core', 'back'],
        workoutType: 'flexibility',
        impactLevel: 'low',
        goals: ['flexibility'],
        gifUrl: ''
    },
    
    // BEGINNER - HOME EQUIPMENT
    {
        name: 'Resistance Band Rows',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'home',
        difficulty: 'beginner',
        targetMuscles: ['back', 'arms'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    {
        name: 'Dumbbell Squats',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'home',
        difficulty: 'beginner',
        targetMuscles: ['legs', 'glutes'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    {
        name: 'Dumbbell Bicep Curls',
        sets: 3,
        reps: 12,
        rest: 45,
        equipment: 'home',
        difficulty: 'beginner',
        targetMuscles: ['arms'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    
    // INTERMEDIATE - NO EQUIPMENT
    {
        name: 'Push-ups',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['chest', 'arms', 'core'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'weight_loss'],
        gifUrl: ''
    },
    {
        name: 'Squats',
        sets: 3,
        reps: 15,
        rest: 60,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['legs', 'glutes'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'weight_loss'],
        gifUrl: ''
    },
    {
        name: 'Plank Hold',
        sets: 3,
        reps: 45,
        rest: 60,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['core'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Lunges',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['legs', 'glutes'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'weight_loss'],
        gifUrl: ''
    },
    {
        name: 'Burpees',
        sets: 3,
        reps: 10,
        rest: 90,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['cardio', 'full_body'],
        workoutType: 'cardio',
        impactLevel: 'high',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Mountain Climbers',
        sets: 3,
        reps: 20,
        rest: 45,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['cardio', 'core'],
        workoutType: 'cardio',
        impactLevel: 'medium',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Jumping Jacks',
        sets: 3,
        reps: 30,
        rest: 30,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['cardio'],
        workoutType: 'cardio',
        impactLevel: 'medium',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'High Knees',
        sets: 3,
        reps: 30,
        rest: 30,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['cardio', 'legs'],
        workoutType: 'cardio',
        impactLevel: 'medium',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Bicycle Crunches',
        sets: 3,
        reps: 20,
        rest: 45,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['core'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Russian Twists',
        sets: 3,
        reps: 20,
        rest: 45,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['core'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Leg Raises',
        sets: 3,
        reps: 15,
        rest: 45,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['core', 'legs'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Pike Push-ups',
        sets: 3,
        reps: 10,
        rest: 60,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['shoulders', 'arms'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Diamond Push-ups',
        sets: 3,
        reps: 10,
        rest: 60,
        equipment: 'none',
        difficulty: 'intermediate',
        targetMuscles: ['chest', 'arms', 'triceps'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    
    // INTERMEDIATE - HOME EQUIPMENT
    {
        name: 'Dumbbell Shoulder Press',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'home',
        difficulty: 'intermediate',
        targetMuscles: ['shoulders', 'arms'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    {
        name: 'Dumbbell Lunges',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'home',
        difficulty: 'intermediate',
        targetMuscles: ['legs', 'glutes'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    {
        name: 'Dumbbell Rows',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'home',
        difficulty: 'intermediate',
        targetMuscles: ['back', 'arms'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    
    // ADVANCED - NO EQUIPMENT
    {
        name: 'Push-ups',
        sets: 4,
        reps: 15,
        rest: 45,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['chest', 'arms', 'core'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'weight_loss'],
        gifUrl: ''
    },
    {
        name: 'Jump Squats',
        sets: 4,
        reps: 15,
        rest: 60,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['legs', 'glutes', 'cardio'],
        workoutType: 'mixed',
        impactLevel: 'high',
        goals: ['weight_loss', 'strength', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Plank Hold',
        sets: 4,
        reps: 60,
        rest: 45,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['core'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Burpees',
        sets: 4,
        reps: 15,
        rest: 60,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['cardio', 'full_body'],
        workoutType: 'cardio',
        impactLevel: 'high',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Mountain Climbers',
        sets: 4,
        reps: 30,
        rest: 30,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['cardio', 'core'],
        workoutType: 'cardio',
        impactLevel: 'medium',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Pike Push-ups',
        sets: 4,
        reps: 15,
        rest: 45,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['shoulders', 'arms'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength'],
        gifUrl: ''
    },
    {
        name: 'Single-leg Squats',
        sets: 3,
        reps: 10,
        rest: 60,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['legs', 'glutes'],
        workoutType: 'strength',
        impactLevel: 'high',
        goals: ['strength', 'balance'],
        gifUrl: ''
    },
    {
        name: 'Hindu Push-ups',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['chest', 'shoulders', 'back'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'flexibility'],
        gifUrl: ''
    },
    {
        name: 'Plank Jacks',
        sets: 3,
        reps: 20,
        rest: 45,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['cardio', 'core'],
        workoutType: 'cardio',
        impactLevel: 'medium',
        goals: ['weight_loss', 'endurance'],
        gifUrl: ''
    },
    {
        name: 'Dips',
        sets: 3,
        reps: 12,
        rest: 60,
        equipment: 'none',
        difficulty: 'advanced',
        targetMuscles: ['arms', 'triceps'],
        workoutType: 'strength',
        impactLevel: 'medium',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    
    // ADVANCED - HOME/GYM EQUIPMENT
    {
        name: 'Pull-ups',
        sets: 3,
        reps: 10,
        rest: 60,
        equipment: 'gym',
        difficulty: 'advanced',
        targetMuscles: ['back', 'arms'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    },
    {
        name: 'Weighted Squats',
        sets: 4,
        reps: 15,
        rest: 60,
        equipment: 'gym',
        difficulty: 'advanced',
        targetMuscles: ['legs', 'glutes'],
        workoutType: 'strength',
        impactLevel: 'low',
        goals: ['strength', 'muscle_gain'],
        gifUrl: ''
    }
];

/**
 * Filter exercises based on user profile
 */
export const filterExercises = (
    exercises: ExerciseDefinition[],
    profile: {
        fitnessLevel: string;
        equipment: string;
        injuries: string[];
        workoutGoals: string[];
        impactLevel?: 'low' | 'medium' | 'high';
    }
): ExerciseDefinition[] => {
    return exercises.filter(ex => {
        // Match difficulty
        if (ex.difficulty !== profile.fitnessLevel) return false;
        
        // Match equipment (allow no equipment if user has none, but don't require gym if user has gym)
        if (profile.equipment === 'none' && ex.equipment !== 'none') return false;
        if (profile.equipment === 'home' && ex.equipment === 'gym') return false;
        
        // Filter out high impact if user has injuries
        if (profile.injuries.length > 0 && ex.impactLevel === 'high') return false;
        
        // Match at least one goal
        if (profile.workoutGoals.length > 0) {
            const hasMatchingGoal = profile.workoutGoals.some(goal => ex.goals.includes(goal));
            if (!hasMatchingGoal) return false;
        }
        
        // Override impact level if specified
        if (profile.impactLevel && ex.impactLevel !== profile.impactLevel) return false;
        
        return true;
    });
};