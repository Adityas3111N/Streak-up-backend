import mongoose, { Schema, Model } from "mongoose";
import { OnboardingAnswer } from "../types/plan.types";

export interface OnboardingInterface extends Document {
    userId: mongoose.Types.ObjectId;
    goalDate?: Date;
    answers: OnboardingAnswer[];
    completedAt: Date;
}

const onboardingSchema: Schema<OnboardingInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    goalDate: {
        type: Date
    },
    answers: [{
        questionId: { type: String, required: true },
        answer: { type: Schema.Types.Mixed, required: true }
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Onboarding: Model<OnboardingInterface> = mongoose.model<OnboardingInterface>("Onboarding", onboardingSchema);

export default Onboarding;