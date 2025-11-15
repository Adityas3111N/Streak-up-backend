import mongoose, { Schema, Model } from "mongoose";

export interface AchievementInterface extends Document {
    userId: mongoose.Types.ObjectId;
    badgeId: string;
    unlockedAt: Date;
    badgeType: 'streak' | 'milestone' | 'week' | 'workout' | 'meal';
}

const achievementSchema: Schema<AchievementInterface> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    badgeId: {
        type: String,
        required: true
    },
    unlockedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    badgeType: {
        type: String,
        enum: ['streak', 'milestone', 'week', 'workout', 'meal'],
        required: true
    }
}, { timestamps: true });

// Compound index to prevent duplicate badges for same user
achievementSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
// Index for sorting by unlock date
achievementSchema.index({ userId: 1, unlockedAt: -1 });

const Achievement: Model<AchievementInterface> = mongoose.model<AchievementInterface>("Achievement", achievementSchema);

export default Achievement;