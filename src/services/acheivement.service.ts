import Achievement from "../models/achievement.model";
import Progress from "../models/progress.model";
import WorkoutLog from "../models/workoutLog.model";
import MealLog from "../models/mealLog.model";
import UserPlan from "../models/userPlan.model";

export interface BadgeDefinition {
    badgeId: string;
    badgeType: 'streak' | 'milestone' | 'week' | 'workout' | 'meal';
    name: string;
    description: string;
    checkEligibility: (userId: string) => Promise<boolean>;
}

/**
 * Badge definitions
 */
const BADGE_DEFINITIONS: BadgeDefinition[] = [
    {
        badgeId: 'first_workout',
        badgeType: 'workout',
        name: 'First Steps',
        description: 'Completed your first workout',
        checkEligibility: async (userId) => {
            const count = await WorkoutLog.countDocuments({ userId });
            return count >= 1;
        }
    },
    {
        badgeId: 'first_meal',
        badgeType: 'meal',
        name: 'Nutrition Start',
        description: 'Logged your first meal',
        checkEligibility: async (userId) => {
            const count = await MealLog.countDocuments({ userId, skipped: false });
            return count >= 1;
        }
    },
    {
        badgeId: 'streak_3',
        badgeType: 'streak',
        name: 'On Fire',
        description: '3-day streak',
        checkEligibility: async (userId) => {
            const progress = await Progress.findOne({ userId });
            return progress ? progress.currentStreak >= 3 : false;
        }
    },
    {
        badgeId: 'streak_7',
        badgeType: 'streak',
        name: 'Week Warrior',
        description: '7-day streak',
        checkEligibility: async (userId) => {
            const progress = await Progress.findOne({ userId });
            return progress ? progress.currentStreak >= 7 : false;
        }
    },
    {
        badgeId: 'streak_14',
        badgeType: 'streak',
        name: 'Two Week Champion',
        description: '14-day streak',
        checkEligibility: async (userId) => {
            const progress = await Progress.findOne({ userId });
            return progress ? progress.currentStreak >= 14 : false;
        }
    },
    {
        badgeId: 'streak_30',
        badgeType: 'streak',
        name: 'Monthly Master',
        description: '30-day streak',
        checkEligibility: async (userId) => {
            const progress = await Progress.findOne({ userId });
            return progress ? progress.currentStreak >= 30 : false;
        }
    },
    {
        badgeId: 'week_1_complete',
        badgeType: 'week',
        name: 'Week 1 Complete',
        description: 'Completed Week 1',
        checkEligibility: async (userId) => {
            const plan = await UserPlan.findOne({ userId, weekNumber: 1 });
            return plan ? plan.status === 'completed' : false;
        }
    },
    {
        badgeId: 'week_4_complete',
        badgeType: 'week',
        name: 'Month Complete',
        description: 'Completed 4 weeks',
        checkEligibility: async (userId) => {
            const count = await UserPlan.countDocuments({ userId, status: 'completed' });
            return count >= 4;
        }
    },
    {
        badgeId: 'week_12_complete',
        badgeType: 'week',
        name: 'Journey Complete',
        description: 'Completed all 12 weeks',
        checkEligibility: async (userId) => {
            const count = await UserPlan.countDocuments({ userId, status: 'completed' });
            return count >= 12;
        }
    },
    {
        badgeId: 'workouts_10',
        badgeType: 'milestone',
        name: 'Workout Warrior',
        description: 'Completed 10 workouts',
        checkEligibility: async (userId) => {
            const count = await WorkoutLog.countDocuments({ userId });
            return count >= 10;
        }
    },
    {
        badgeId: 'workouts_50',
        badgeType: 'milestone',
        name: 'Fitness Fanatic',
        description: 'Completed 50 workouts',
        checkEligibility: async (userId) => {
            const count = await WorkoutLog.countDocuments({ userId });
            return count >= 50;
        }
    },
    {
        badgeId: 'meals_30',
        badgeType: 'milestone',
        name: 'Nutrition Navigator',
        description: 'Logged 30 meals',
        checkEligibility: async (userId) => {
            const count = await MealLog.countDocuments({ userId, skipped: false });
            return count >= 30;
        }
    }
];

/**
 * Check and award eligible badges
 */
export const checkAndAwardBadges = async (userId: string): Promise<string[]> => {
    const awardedBadges: string[] = [];
    
    for (const badge of BADGE_DEFINITIONS) {
        // Skip if already awarded
        const existing = await Achievement.findOne({ userId, badgeId: badge.badgeId });
        if (existing) continue;
        
        // Check eligibility
        const eligible = await badge.checkEligibility(userId);
        if (eligible) {
            await Achievement.create({
                userId,
                badgeId: badge.badgeId,
                badgeType: badge.badgeType,
                unlockedAt: new Date()
            });
            awardedBadges.push(badge.badgeId);
        }
    }
    
    return awardedBadges;
};

/**
 * Get user's achievements
 */
export const getUserAchievements = async (userId: string) => {
    const achievements = await Achievement.find({ userId })
        .sort({ unlockedAt: -1 })
        .lean();
    
    return achievements.map(achievement => {
        const badgeDef = BADGE_DEFINITIONS.find(b => b.badgeId === achievement.badgeId);
        return {
            ...achievement,
            name: badgeDef?.name || achievement.badgeId,
            description: badgeDef?.description || ''
        };
    });
};

/**
 * Get all available badges
 */
export const getAllBadges = () => {
    return BADGE_DEFINITIONS.map(badge => ({
        badgeId: badge.badgeId,
        badgeType: badge.badgeType,
        name: badge.name,
        description: badge.description
    }));
};