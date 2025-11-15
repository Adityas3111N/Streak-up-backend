import mongoose, { Schema, Model } from "mongoose";

export interface WorkoutLogInterface extends Document {
    userId: mongoose.Types.ObjectId;
    workoutId: mongoose.Types.ObjectId;
    completedAt: Date;
    exercisesCompleted: Array<{
        exerciseName: string;
        setsCompleted: number;
        repsCompleted: number;
    }>;
    notes?: string;
}

const workoutLogSchema: Schema<WorkoutLogInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    workoutId: {
        type: Schema.Types.ObjectId,
        ref: 'Workout',
        required: true
    },
    completedAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },
    exercisesCompleted: [{
        exerciseName: { type: String, required: true },
        setsCompleted: { type: Number, required: true, min: 0 },
        repsCompleted: { type: Number, required: true, min: 0 }
    }],
    notes: {
        type: String
    }
}, { timestamps: true });

// Compound index for user workout history queries
workoutLogSchema.index({ userId: 1, completedAt: -1 });

const WorkoutLog: Model<WorkoutLogInterface> = mongoose.model<WorkoutLogInterface>("WorkoutLog", workoutLogSchema);

export default WorkoutLog;