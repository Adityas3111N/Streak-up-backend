import { UserProfile } from "./userProfile.util";
import { SeededRandom } from "./userProfile.util";
import { MEAL_LIBRARY, MealDefinition, filterMeals } from "../data/mealLibrary";

/**
 * Generate personalized meal for a specific day and meal type
 */
export const generatePersonalizedMeal = (
    profile: UserProfile,
    weekNumber: number,
    day: number,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    random: SeededRandom
): MealDefinition => {
    // Filter meals based on profile
    const availableMeals = filterMeals(MEAL_LIBRARY, {
        dietaryRestrictions: profile.dietaryRestrictions,
        cuisinePreferences: profile.cuisinePreferences.length > 0 ? profile.cuisinePreferences : [],
        mealPrepTime: profile.mealPrepTime,
        cookingSkill: profile.cookingSkill
    });
    
    // Filter by meal type
    const typeFiltered = availableMeals.filter(m => m.mealType === mealType);
    
    if (typeFiltered.length === 0) {
        // Fallback to default meals
        return getDefaultMeal(mealType, weekNumber);
    }
    
    // Vary meals by week and day (same user gets same meal on same day/week)
    const weekDaySeed = weekNumber * 7 + day;
    const mealIndex = Math.floor(random.next() * typeFiltered.length);
    
    // Use week progression to select appropriate meal difficulty
    const weekFiltered = typeFiltered.filter(m => {
        if (weekNumber <= 2 && m.difficulty === 'advanced') return false;
        if (weekNumber >= 10 && m.difficulty === 'beginner') return false;
        return true;
    });
    
    const mealsToChoose = weekFiltered.length > 0 ? weekFiltered : typeFiltered;
    
    // Select meal with some variety
    const selectedMeal = mealsToChoose[mealIndex % mealsToChoose.length];
    
    return selectedMeal;
};

/**
 * Fallback default meal
 */
const getDefaultMeal = (
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    weekNumber: number
): MealDefinition => {
    const defaults = {
        breakfast: {
            mealType: 'breakfast' as const,
            instruction: 'Start your day with a balanced breakfast including protein and whole grains.',
            examples: ['Greek yogurt with berries and granola', 'Oatmeal with banana and nuts', 'Scrambled eggs with whole grain toast'],
            dietaryTags: [],
            cuisineType: ['american'],
            prepTime: 'quick' as const,
            difficulty: 'beginner' as const,
            calories: 350,
            macros: { protein: '20g', carbs: '45g', fats: '12g' }
        },
        lunch: {
            mealType: 'lunch' as const,
            instruction: 'Have a well-balanced lunch with vegetables, lean protein, and healthy fats.',
            examples: ['Grilled chicken salad with mixed vegetables', 'Quinoa bowl with vegetables and chickpeas', 'Turkey wrap with whole grain tortilla'],
            dietaryTags: [],
            cuisineType: ['american'],
            prepTime: 'moderate' as const,
            difficulty: 'intermediate' as const,
            calories: 450,
            macros: { protein: '30g', carbs: '55g', fats: '12g' }
        },
        dinner: {
            mealType: 'dinner' as const,
            instruction: 'Finish your day with a nutritious dinner focusing on lean protein and vegetables.',
            examples: ['Grilled salmon with roasted vegetables', 'Lean beef stir-fry with brown rice', 'Baked chicken with sweet potato and broccoli'],
            dietaryTags: [],
            cuisineType: ['american'],
            prepTime: 'moderate' as const,
            difficulty: 'intermediate' as const,
            calories: 550,
            macros: { protein: '40g', carbs: '45g', fats: '18g' }
        },
        snack: {
            mealType: 'snack' as const,
            instruction: 'Choose nutrient-dense snacks between meals.',
            examples: ['Apple with almond butter', 'Greek yogurt with berries', 'Mixed nuts and dried fruit'],
            dietaryTags: [],
            cuisineType: ['american'],
            prepTime: 'quick' as const,
            difficulty: 'beginner' as const,
            calories: 175,
            macros: { protein: '8g', carbs: '20g', fats: '8g' }
        }
    };
    
    return defaults[mealType];
};