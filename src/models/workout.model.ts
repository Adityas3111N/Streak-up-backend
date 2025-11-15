import mongoose, { Schema, Model } from "mongoose";
import { WorkoutExercise } from "../types/plan.types";

export interface WorkoutInterface extends Document {
    name: string;
    duration: number; // minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    day: number; // 0-6 (Sunday-Saturday)
    exercises: WorkoutExercise[];
    weekNumber: number;
    workoutType: 'strength' | 'cardio' | 'flexibility' | 'mixed';
}

const workoutSchema: Schema<WorkoutInterface> = new Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    day: {
        type: Number,
        required: true,
        min: 0,
        max: 6
    },
    exercises: [{
        name: { type: String, required: true },
        sets: { type: Number, required: true, min: 1 },
        reps: { type: Number, required: true, min: 1 },
        rest: { type: Number, required: true, min: 0 },
        gifUrl: { type: String },
        notes: { type: String }
    }],
    weekNumber: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    workoutType: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility', 'mixed'],
        required: true
    }
}, { timestamps: true });

// Indexes for efficient queries
workoutSchema.index({ weekNumber: 1, day: 1 });
workoutSchema.index({ difficulty: 1 });

const Workout: Model<WorkoutInterface> = mongoose.model<WorkoutInterface>("Workout", workoutSchema);

export default Workout;