import { UserProfile } from "./userProfile.util";
import { SeededRandom } from "./userProfile.util";
import { EXERCISE_LIBRARY, ExerciseDefinition, filterExercises } from "../data/exerciseLibrary";
import { WorkoutExercise } from "../types/plan.types";

/**
 * Generate personalized workout exercises for a week
 */
export const generatePersonalizedWorkout = (
    profile: UserProfile,
    weekNumber: number,
    day: number,
    random: SeededRandom
): WorkoutExercise[] => {
    // Determine target difficulty based on week progression
    let targetDifficulty: 'beginner' | 'intermediate' | 'advanced' = profile.fitnessLevel;
    
    // Progressive difficulty over 12 weeks
    if (weekNumber <= 2 && profile.fitnessLevel !== 'beginner') {
        targetDifficulty = 'beginner';
    } else if (weekNumber <= 4 && profile.fitnessLevel === 'advanced') {
        targetDifficulty = 'intermediate';
    }
    
    // Filter exercises based on profile
    const availableExercises = filterExercises(EXERCISE_LIBRARY, {
        fitnessLevel: targetDifficulty,
        equipment: profile.equipment,
        injuries: profile.injuries,
        workoutGoals: profile.workoutGoals.length > 0 ? profile.workoutGoals : ['strength'],
        impactLevel: profile.injuries.length > 0 ? 'low' : undefined
    });
    
    if (availableExercises.length === 0) {
        // Fallback to basic exercises
        return getDefaultExercises(weekNumber, targetDifficulty);
    }
    
    // Determine workout type based on goals and week
    const workoutType = determineWorkoutType(profile, weekNumber, day);
    
    // Filter by workout type preference
    const typeFiltered = availableExercises.filter(ex => {
        if (workoutType === 'cardio' && ex.workoutType !== 'cardio' && ex.workoutType !== 'mixed') return false;
        if (workoutType === 'strength' && ex.workoutType !== 'strength' && ex.workoutType !== 'mixed') return false;
        return true;
    });
    
    const exercisesToUse = typeFiltered.length > 0 ? typeFiltered : availableExercises;
    
    // Select exercises with variety (ensure different muscle groups)
    const selectedExercises = selectVariedExercises(exercisesToUse, weekNumber, random);
    
    // Adjust sets/reps based on week progression
    return adjustExerciseIntensity(selectedExercises, weekNumber, targetDifficulty);
};

/**
 * Determine workout type based on goals and week
 */
const determineWorkoutType = (
    profile: UserProfile,
    weekNumber: number,
    day: number
): 'strength' | 'cardio' | 'flexibility' | 'mixed' => {
    // Rotate workout types throughout the week
    if (profile.workoutGoals.includes('weight_loss')) {
        // More cardio for weight loss
        const dayTypes = ['cardio', 'mixed', 'strength', 'cardio', 'mixed'];
        return dayTypes[(day - 1) % dayTypes.length] as any;
    } else if (profile.workoutGoals.includes('strength') || profile.workoutGoals.includes('muscle_gain')) {
        // More strength focus
        const dayTypes = ['strength', 'mixed', 'strength', 'strength', 'mixed'];
        return dayTypes[(day - 1) % dayTypes.length] as any;
    }
    
    // Default rotation
    return weekNumber <= 4 ? 'mixed' : weekNumber <= 8 ? 'strength' : 'mixed';
};

/**
 * Select exercises ensuring variety across muscle groups
 */
const selectVariedExercises = (
    exercises: ExerciseDefinition[],
    weekNumber: number,
    random: SeededRandom
): ExerciseDefinition[] => {
    const numExercises = weekNumber <= 2 ? 3 : weekNumber <= 5 ? 4 : 5;
    
    // Shuffle exercises
    const shuffled = random.shuffle([...exercises]);
    
    // Select ensuring muscle group variety
    const selected: ExerciseDefinition[] = [];
    const usedMuscleGroups = new Set<string>();
    
    for (const exercise of shuffled) {
        // Check if this exercise adds variety
        const hasNewMuscleGroup = exercise.targetMuscles.some(muscle => !usedMuscleGroups.has(muscle));
        
        if (selected.length < numExercises) {
            if (hasNewMuscleGroup || selected.length < 2) {
                selected.push(exercise);
                exercise.targetMuscles.forEach(muscle => usedMuscleGroups.add(muscle));
            }
        }
        
        if (selected.length >= numExercises) break;
    }
    
    // Fill remaining slots if needed
    while (selected.length < numExercises && shuffled.length > 0) {
        const notSelected = shuffled.find(ex => !selected.includes(ex));
        if (notSelected) {
            selected.push(notSelected);
        } else {
            break;
        }
    }
    
    return selected.slice(0, numExercises);
};

/**
 * Adjust exercise intensity based on week progression
 */
const adjustExerciseIntensity = (
    exercises: ExerciseDefinition[],
    weekNumber: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
): WorkoutExercise[] => {
    return exercises.map(ex => {
        let sets = ex.sets;
        let reps = ex.reps;
        let rest = ex.rest;
        
        // Progressive overload over weeks
        const progressionFactor = (weekNumber - 1) / 11; // 0 to 1
        
        if (difficulty === 'beginner') {
            sets = Math.max(2, Math.floor(sets * (1 + progressionFactor * 0.2)));
            reps = Math.max(5, Math.floor(reps * (1 + progressionFactor * 0.3)));
            rest = Math.max(30, Math.floor(rest * (1 - progressionFactor * 0.2)));
        } else if (difficulty === 'intermediate') {
            sets = Math.floor(sets * (1 + progressionFactor * 0.15));
            reps = Math.floor(reps * (1 + progressionFactor * 0.2));
            rest = Math.max(30, Math.floor(rest * (1 - progressionFactor * 0.15)));
        } else {
            sets = Math.floor(sets * (1 + progressionFactor * 0.1));
            reps = Math.floor(reps * (1 + progressionFactor * 0.15));
            rest = Math.max(30, Math.floor(rest * (1 - progressionFactor * 0.1)));
        }
        
        return {
            name: ex.name,
            sets,
            reps,
            rest,
            gifUrl: ex.gifUrl,
            notes: ex.notes
        };
    });
};

/**
 * Fallback default exercises
 */
const getDefaultExercises = (
    weekNumber: number,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
): WorkoutExercise[] => {
    const defaults = {
        beginner: [
            { name: 'Push-ups', sets: 2, reps: 8, rest: 60 },
            { name: 'Squats', sets: 2, reps: 10, rest: 60 },
            { name: 'Plank', sets: 2, reps: 20, rest: 45 }
        ],
        intermediate: [
            { name: 'Push-ups', sets: 3, reps: 12, rest: 60 },
            { name: 'Squats', sets: 3, reps: 15, rest: 60 },
            { name: 'Plank', sets: 3, reps: 45, rest: 60 },
            { name: 'Lunges', sets: 3, reps: 12, rest: 60 }
        ],
        advanced: [
            { name: 'Push-ups', sets: 4, reps: 15, rest: 45 },
            { name: 'Squats', sets: 4, reps: 15, rest: 45 },
            { name: 'Plank', sets: 4, reps: 60, rest: 45 },
            { name: 'Burpees', sets: 3, reps: 12, rest: 60 },
            { name: 'Mountain Climbers', sets: 3, reps: 30, rest: 30 }
        ]
    };
    
    return defaults[difficulty];
};