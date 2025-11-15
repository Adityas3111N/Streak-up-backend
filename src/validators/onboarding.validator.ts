import { z } from "zod";

export const submitAnswersSchema = z.object({
    answers: z.array(z.object({
        questionId: z.string().min(1),
        answer: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
    })).length(15, "Must provide exactly 15 answers"),
    goalDate: z.string().datetime().optional().or(z.date().optional())
});

export const getAnswersSchema = z.object({
    userId: z.string().optional() // Optional, will use auth if not provided
});