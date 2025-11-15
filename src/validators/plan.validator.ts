import { z } from "zod";

export const generatePlanSchema = z.object({}).strict();

export const getWeekPlanSchema = z.object({
    weekNumber: z.coerce.number().int().min(1).max(12).optional(),
});

export const unlockNextWeekSchema = z.object({
    weekNumber: z.coerce.number().int().min(1).max(12).optional(),
});
