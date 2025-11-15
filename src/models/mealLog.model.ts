import mongoose, { Schema, Model } from "mongoose";

export interface MealLogInterface extends Document {
    userId: mongoose.Types.ObjectId;
    mealId: mongoose.Types.ObjectId;
    completedAt: Date;
    skipped: boolean;
}

const mealLogSchema: Schema<MealLogInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    mealId: {
        type: Schema.Types.ObjectId,
        ref: 'Meal',
        required: true
    },
    completedAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    skipped: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Compound index for user meal history queries
mealLogSchema.index({ userId: 1, completedAt: -1 });

const MealLog: Model<MealLogInterface> = mongoose.model<MealLogInterface>("MealLog", mealLogSchema);

export default MealLog;