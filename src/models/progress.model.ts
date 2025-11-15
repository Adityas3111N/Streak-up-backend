import mongoose, { Document, Schema, Model } from "mongoose";

export interface ProgressInterface extends Document {
    userId: mongoose.Types.ObjectId;
    currentStreak: number;
    longestStreak: number;
    totalWorkoutsCompleted: number;
    totalMealsLogged: number;
    weeklyCompletionRate: Record<string, number>; // weekNumber -> percentage
    lastActiveDate: Date;
}

const progressSchema: Schema<ProgressInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    currentStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    longestStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    totalWorkoutsCompleted: {
        type: Number,
        default: 0,
        min: 0
    },
    totalMealsLogged: {
        type: Number,
        default: 0,
        min: 0
    },
    weeklyCompletionRate: {
        type: Schema.Types.Mixed,
        default: {}
    },
    lastActiveDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Progress: Model<ProgressInterface> = mongoose.model<ProgressInterface>("Progress", progressSchema);

export default Progress;