import User from "../models/user.model";
import UserPlan from "../models/userPlan.model";
import Onboarding from "../models/onboarding.model";
import Workout from "../models/workout.model";
import Meal from "../models/meal.model";
import Progress from "../models/progress.model";
import { getWeekDates } from "../utils/date.util";
import { getWorkoutFrequency, getWorkoutDays, getWorkoutDuration } from "../utils/planLogic.util";
import { extractUserProfile, createUserSeed, SeededRandom } from "../utils/userProfile.util";
import { generatePersonalizedWorkout } from "../utils/workoutGenerator.util";
import { generatePersonalizedMeal } from "../utils/mealGenerator.util";

/**
 * Generate personalized 12-week plan based on onboarding answers
 */
export const generatePlan = async (userId: string): Promise<void> => {
    try {
        // Get onboarding data
        const onboarding = await Onboarding.findOne({ userId });
        if (!onboarding) {
            throw new Error("Onboarding not completed");
        }
        
        // Validate onboarding has answers
        if (!onboarding.answers || onboarding.answers.length === 0) {
            throw new Error("Onboarding answers are missing");
        }
        
        // Extract user profile
        const profile = extractUserProfile(onboarding.answers);
        
        // Validate profile has minimum required fields
        if (!profile.fitnessLevel || !profile.equipment) {
            throw new Error("Invalid user profile extracted from onboarding");
        }
    
        // Create seeded random for consistent personalization
        const userSeed = createUserSeed(userId);
        const random = new SeededRandom(userSeed);
        
        // Update user
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        
        user.goalDate = onboarding.goalDate;
        user.onboardingCompleted = true;
        user.currentWeek = 1;
        
        const planStartDate = new Date();
        planStartDate.setHours(0, 0, 0, 0);
        
        // Get workout frequency and days
        const workoutFrequency = profile.workoutFrequency || getWorkoutFrequency(onboarding.answers);
        const workoutDays = getWorkoutDays(workoutFrequency);
        
        // Generate plans for all 12 weeks
        for (let weekNumber = 1; weekNumber <= 12; weekNumber++) {
            const { start, end } = getWeekDates(planStartDate, weekNumber);
            
            // Generate personalized workouts for this week
            const workoutIds = await generatePersonalizedWorkoutsForWeek(
                userId,
                weekNumber,
                workoutDays,
                profile,
                random
            );
            
            // Generate personalized meals for this week
            const mealIds = await generatePersonalizedMealsForWeek(
                userId,
                weekNumber,
                profile,
                random
            );
            
            // Create user plan
            const status = weekNumber === 1 ? 'unlocked' : 'locked';
            
            await UserPlan.create({
                userId,
                weekNumber,
                workouts: workoutIds,
                meals: mealIds,
                status,
                startDate: start,
                endDate: end
            });
        }
        
        // Initialize progress
        await Progress.findOneAndUpdate(
            { userId },
            {
                userId,
                currentStreak: 0,
                longestStreak: 0,
                totalWorkoutsCompleted: 0,
                totalMealsLogged: 0,
                weeklyCompletionRate: {},
                lastActiveDate: new Date()
            },
            { upsert: true }
        );
        
        await user.save();
        
    } catch (error: any) {
        console.error("Plan generation error:", error);
        throw error;
    }
};

/**
 * Generate personalized workouts for a week
 */
const generatePersonalizedWorkoutsForWeek = async (
    userId: string,
    weekNumber: number,
    workoutDays: number[],
    profile: any,
    random: SeededRandom
): Promise<string[]> => {
    const workoutIds: string[] = [];
    const duration = getWorkoutDuration(weekNumber);
    
    // Determine workout type based on week
    const getWorkoutType = (week: number): 'strength' | 'cardio' | 'flexibility' | 'mixed' => {
        if (week <= 4) return 'mixed';
        if (week <= 8) return 'strength';
        return 'mixed';
    };
    
    for (const day of workoutDays) {
        // Generate personalized exercises
        const exercises = generatePersonalizedWorkout(profile, weekNumber, day, random);
        
        // Determine difficulty based on week progression
        let difficulty: 'beginner' | 'intermediate' | 'advanced' = profile.fitnessLevel;
        if (weekNumber <= 2 && profile.fitnessLevel !== 'beginner') {
            difficulty = 'beginner';
        } else if (weekNumber <= 4 && profile.fitnessLevel === 'advanced') {
            difficulty = 'intermediate';
        }
        
        const workoutName = getWorkoutName(weekNumber, day, profile);
        
        const workout = await Workout.create({
            name: workoutName,
            duration,
            difficulty,
            day,
            weekNumber,
            workoutType: getWorkoutType(weekNumber),
            exercises
        });
        
        workoutIds.push(workout._id.toString());
    }
    
    return workoutIds;
};

/**
 * Generate personalized meals for a week
 */
const generatePersonalizedMealsForWeek = async (
    userId: string,
    weekNumber: number,
    profile: any,
    random: SeededRandom
): Promise<string[]> => {
    const mealIds: string[] = [];
    const mealTypes: Array<'breakfast' | 'lunch' | 'dinner'> = ['breakfast', 'lunch', 'dinner'];
    
    for (let day = 1; day <= 7; day++) {
        for (const mealType of mealTypes) {
            const mealTemplate = generatePersonalizedMeal(profile, weekNumber, day, mealType, random);
            
            const meal = await Meal.create({
                day,
                mealType,
                weekNumber,
                instruction: mealTemplate.instruction,
                examples: mealTemplate.examples
            });
            
            mealIds.push(meal._id.toString());
        }
    }
    
    return mealIds;
};

/**
 * Generate personalized workout name
 */
const getWorkoutName = (
    weekNumber: number,
    day: number,
    profile: any
): string => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[day] || 'Day';
    
    // Add personalization based on goals (with safety check)
    const goals = Array.isArray(profile.workoutGoals) ? profile.workoutGoals : [];
    let prefix = '';
    if (goals.includes('weight_loss')) {
        prefix = 'Fat Burn ';
    } else if (goals.includes('strength')) {
        prefix = 'Strength Builder ';
    } else if (goals.includes('endurance')) {
        prefix = 'Endurance ';
    } else {
        prefix = 'Full Body ';
    }
    
    return `${prefix}Week ${weekNumber} - ${dayName}`;
};