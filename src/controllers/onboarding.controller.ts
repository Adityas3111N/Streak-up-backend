import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { error, success } from "../utils/response.util";
import Onboarding from "../models/onboarding.model";
import User from "../models/user.model";
import { generatePlan } from "../services/planGeneration.service";

/**
 * Submit onboarding answers
 */
export const submitAnswers = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const { answers, goalDate } = req.body;

        // Check if already completed
        const existing = await Onboarding.findOne({ userId });
        if (existing) {
            return error(res, "Onboarding already completed", 400);
        }

        // Create onboarding record
        const onboarding = await Onboarding.create({
            userId,
            answers,
            goalDate: goalDate ? new Date(goalDate) : undefined,
            completedAt: new Date()
        });

        // Update user with goal date
        const user = await User.findById(userId);
        if (user && goalDate) {
            user.goalDate = new Date(goalDate);
            await user.save();
        }

        // Generate plan automatically
        try {
            await generatePlan(userId);
        } catch (planError: any) {
            console.error("Plan generation error:", planError);
            return error(res, "Onboarding saved but plan generation failed: " + planError.message, 500);
        }

        return success(res, {
            message: "Onboarding completed successfully",
            onboarding: {
                id: onboarding._id,
                completedAt: onboarding.completedAt
            }
        }, 201);

    } catch (err: any) {
        console.error("Submit answers error:", err);
        if (err.name === "ValidationError") {
            return error(res, err.message, 400);
        }
        return error(res, "Server error", 500);
    }
};

/**
 * Get onboarding answers
 */
export const getAnswers = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.auth?.id;
        if (!userId) return error(res, "Unauthorized", 401);

        const onboarding = await Onboarding.findOne({ userId });
        if (!onboarding) {
            return error(res, "Onboarding not found", 404);
        }

        return success(res, {
            answers: onboarding.answers,
            goalDate: onboarding.goalDate,
            completedAt: onboarding.completedAt
        });

    } catch (err: any) {
        console.error("Get answers error:", err);
        return error(res, "Server error", 500);
    }
};