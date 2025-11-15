import mongoose, { Schema, Model } from "mongoose";

export interface UserPlanInterface extends Document {
    userId: mongoose.Types.ObjectId;
    weekNumber: number;
    workouts: mongoose.Types.ObjectId[];
    meals: mongoose.Types.ObjectId[];
    status: 'locked' | 'unlocked' | 'completed';
    startDate?: Date;
    endDate?: Date;
}

const userPlanSchema: Schema<UserPlanInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    weekNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    workouts: [{
        type: Schema.Types.ObjectId,
        ref: 'Workout'
    }],
    meals: [{
        type: Schema.Types.ObjectId,
        ref: 'Meal'
    }],
    status: {
        type: String,
        enum: ['locked', 'unlocked', 'completed'],
        default: 'locked'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, { timestamps: true });

// Compound index for quick lookups
userPlanSchema.index({ userId: 1, weekNumber: 1 }, { unique: true });

const UserPlan: Model<UserPlanInterface> = mongoose.model<UserPlanInterface>("UserPlan", userPlanSchema);

export default UserPlan;