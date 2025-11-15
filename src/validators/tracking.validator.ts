import { z } from "zod";

export const completeWorkoutSchema = z.object({
    workoutId: z.string().min(1),
    exercisesCompleted: z.array(z.object({
        exerciseName: z.string().min(1),
        setsCompleted: z.number().int().min(0),
        repsCompleted: z.number().int().min(0)
    })).min(1),
    notes: z.string().optional()
});

export const logMealSchema = z.object({
    mealId: z.string().min(1),
    skipped: z.boolean().default(false)
});

export const skipMealSchema = z.object({
    mealId: z.string().min(1)
});

export const getWorkoutsSchema = z.object({
    weekNumber: z.coerce.number().int().min(1).max(12).optional()
});

export const getMealsSchema = z.object({
    weekNumber: z.coerce.number().int().min(1).max(12).optional(),
    day: z.coerce.number().int().min(1).max(7).optional()
});