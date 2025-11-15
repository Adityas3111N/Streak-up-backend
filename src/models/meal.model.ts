import mongoose, { Schema, Model } from "mongoose";

export interface MealInterface extends Document {
    day: number; // 1-7
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    instruction: string;
    examples: string[];
    weekNumber: number;
}

const mealSchema: Schema<MealInterface> = new Schema({
    day: {
        type: Number,
        required: true,
        min: 1,
        max: 7
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    instruction: {
        type: String,
        required: true
    },
    examples: [{
        type: String
    }],
    weekNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    }
}, { timestamps: true });

// Indexes for efficient queries
mealSchema.index({ weekNumber: 1, day: 1, mealType: 1 });

const Meal: Model<MealInterface> = mongoose.model<MealInterface>("Meal", mealSchema);

export default Meal;