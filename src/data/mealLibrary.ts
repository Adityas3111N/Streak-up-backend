export interface MealDefinition {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    instruction: string;
    examples: string[];
    dietaryTags: string[]; // ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'keto', 'paleo']
    cuisineType: string[]; // ['mediterranean', 'asian', 'mexican', 'american', 'indian']
    prepTime: 'quick' | 'moderate' | 'elaborate';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    calories: number; // estimated
    macros: {
        protein: string;
        carbs: string;
        fats: string;
    };
}

export const MEAL_LIBRARY: MealDefinition[] = [
    // BREAKFAST OPTIONS
    {
        mealType: 'breakfast',
        instruction: 'Start your day with a balanced breakfast including protein and whole grains. Aim for 300-400 calories.',
        examples: [
            'Greek yogurt with berries and granola',
            'Oatmeal with banana and nuts',
            'Scrambled eggs with whole grain toast'
        ],
        dietaryTags: [],
        cuisineType: ['american'],
        prepTime: 'quick',
        difficulty: 'beginner',
        calories: 350,
        macros: { protein: '20g', carbs: '45g', fats: '12g' }
    },
    {
        mealType: 'breakfast',
        instruction: 'Include lean protein and complex carbohydrates in your morning meal. Focus on nutrient density.',
        examples: [
            'Protein pancakes with fruit',
            'Avocado toast with eggs',
            'Chia pudding with nuts',
            'Breakfast burrito with whole grain tortilla'
        ],
        dietaryTags: [],
        cuisineType: ['american', 'mediterranean'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 400,
        macros: { protein: '25g', carbs: '50g', fats: '15g' }
    },
    {
        mealType: 'breakfast',
        instruction: 'Fuel your active day with a protein-rich breakfast. Include healthy fats for sustained energy.',
        examples: [
            'Egg scramble with vegetables',
            'Quinoa breakfast bowl',
            'Protein smoothie with greens',
            'Whole grain toast with nut butter and banana'
        ],
        dietaryTags: [],
        cuisineType: ['american'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 420,
        macros: { protein: '28g', carbs: '48g', fats: '16g' }
    },
    // VEGETARIAN BREAKFAST
    {
        mealType: 'breakfast',
        instruction: 'Start your day with plant-based protein and whole grains. Perfect for sustained energy.',
        examples: [
            'Chia seed pudding with berries',
            'Overnight oats with almond butter',
            'Tofu scramble with vegetables',
            'Whole grain toast with avocado and tomato'
        ],
        dietaryTags: ['vegetarian'],
        cuisineType: ['american', 'mediterranean'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 380,
        macros: { protein: '18g', carbs: '52g', fats: '14g' }
    },
    // VEGAN BREAKFAST
    {
        mealType: 'breakfast',
        instruction: 'Plant-powered breakfast with whole foods. High in fiber and nutrients.',
        examples: [
            'Vegan smoothie bowl with granola',
            'Oatmeal with almond milk and fruits',
            'Avocado toast on whole grain bread',
            'Chia pudding with coconut milk'
        ],
        dietaryTags: ['vegan'],
        cuisineType: ['american'],
        prepTime: 'quick',
        difficulty: 'beginner',
        calories: 360,
        macros: { protein: '12g', carbs: '55g', fats: '18g' }
    },
    // GLUTEN-FREE BREAKFAST
    {
        mealType: 'breakfast',
        instruction: 'Gluten-free breakfast options that are both nutritious and satisfying.',
        examples: [
            'Scrambled eggs with sweet potato hash',
            'Greek yogurt with gluten-free granola',
            'Quinoa porridge with fruits',
            'Smoothie bowl with gluten-free toppings'
        ],
        dietaryTags: ['gluten_free'],
        cuisineType: ['american'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 370,
        macros: { protein: '22g', carbs: '42g', fats: '15g' }
    },
    
    // LUNCH OPTIONS
    {
        mealType: 'lunch',
        instruction: 'Have a well-balanced lunch with vegetables, lean protein, and healthy fats. Aim for 400-500 calories.',
        examples: [
            'Grilled chicken salad with mixed vegetables',
            'Quinoa bowl with vegetables and chickpeas',
            'Turkey wrap with whole grain tortilla',
            'Lentil soup with whole grain bread'
        ],
        dietaryTags: [],
        cuisineType: ['american', 'mediterranean'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 450,
        macros: { protein: '30g', carbs: '55g', fats: '12g' }
    },
    {
        mealType: 'lunch',
        instruction: 'Include a variety of colors and nutrients in your midday meal. Focus on whole foods.',
        examples: [
            'Salmon with roasted vegetables',
            'Bean and vegetable stir-fry',
            'Chicken and vegetable skewers',
            'Mediterranean bowl with hummus'
        ],
        dietaryTags: [],
        cuisineType: ['mediterranean', 'asian'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 480,
        macros: { protein: '32g', carbs: '58g', fats: '14g' }
    },
    {
        mealType: 'lunch',
        instruction: 'Opt for whole foods and avoid processed options. Ensure adequate protein and fiber.',
        examples: [
            'Lean beef with sweet potato and broccoli',
            'Tuna salad with mixed greens',
            'Stuffed bell peppers with quinoa',
            'Asian-inspired chicken and vegetable bowl'
        ],
        dietaryTags: [],
        cuisineType: ['american', 'asian'],
        prepTime: 'elaborate',
        difficulty: 'advanced',
        calories: 500,
        macros: { protein: '35g', carbs: '52g', fats: '16g' }
    },
    // VEGETARIAN LUNCH
    {
        mealType: 'lunch',
        instruction: 'Plant-based lunch with complete proteins and plenty of vegetables.',
        examples: [
            'Chickpea curry with brown rice',
            'Lentil and vegetable stew',
            'Quinoa salad with roasted vegetables',
            'Vegetable stir-fry with tofu'
        ],
        dietaryTags: ['vegetarian'],
        cuisineType: ['asian', 'mediterranean', 'indian'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 420,
        macros: { protein: '18g', carbs: '65g', fats: '10g' }
    },
    // VEGAN LUNCH
    {
        mealType: 'lunch',
        instruction: 'Nutrient-dense vegan lunch with plant proteins and colorful vegetables.',
        examples: [
            'Black bean and sweet potato bowl',
            'Chickpea salad wrap',
            'Vegan buddha bowl',
            'Lentil soup with whole grain bread'
        ],
        dietaryTags: ['vegan'],
        cuisineType: ['mediterranean', 'asian'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 410,
        macros: { protein: '15g', carbs: '68g', fats: '12g' }
    },
    
    // DINNER OPTIONS
    {
        mealType: 'dinner',
        instruction: 'Finish your day with a nutritious dinner focusing on lean protein and vegetables. Aim for 500-600 calories.',
        examples: [
            'Grilled salmon with roasted vegetables',
            'Lean beef stir-fry with brown rice',
            'Baked chicken with sweet potato and broccoli',
            'Turkey meatballs with zucchini noodles'
        ],
        dietaryTags: [],
        cuisineType: ['american'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 550,
        macros: { protein: '40g', carbs: '45g', fats: '18g' }
    },
    {
        mealType: 'dinner',
        instruction: 'Keep dinner balanced and avoid heavy meals close to bedtime. Include fiber-rich vegetables.',
        examples: [
            'Herb-crusted chicken with quinoa',
            'Fish tacos with slaw',
            'Stuffed chicken breast with vegetables',
            'Lentil curry with brown rice'
        ],
        dietaryTags: [],
        cuisineType: ['american', 'mediterranean', 'indian'],
        prepTime: 'elaborate',
        difficulty: 'advanced',
        calories: 580,
        macros: { protein: '42g', carbs: '48g', fats: '20g' }
    },
    {
        mealType: 'dinner',
        instruction: 'Include quality protein sources and nutrient-dense vegetables. Maintain portion control.',
        examples: [
            'Grilled steak with roasted vegetables',
            'Baked cod with quinoa and asparagus',
            'Chicken and vegetable kebabs',
            'Stuffed bell peppers with lean ground turkey'
        ],
        dietaryTags: [],
        cuisineType: ['american', 'mediterranean'],
        prepTime: 'moderate',
        difficulty: 'intermediate',
        calories: 600,
        macros: { protein: '45g', carbs: '42g', fats: '22g' }
    },
    // VEGETARIAN DINNER
    {
        mealType: 'dinner',
        instruction: 'Satisfying vegetarian dinner with plant proteins and wholesome ingredients.',
        examples: [
            'Vegetable curry with brown rice',
            'Lentil shepherd\'s pie',
            'Stuffed bell peppers with quinoa',
            'Chickpea and vegetable tagine'
        ],
        dietaryTags: ['vegetarian'],
        cuisineType: ['indian', 'mediterranean'],
        prepTime: 'elaborate',
        difficulty: 'advanced',
        calories: 520,
        macros: { protein: '20g', carbs: '75g', fats: '12g' }
    },
    // VEGAN DINNER
    {
        mealType: 'dinner',
        instruction: 'Plant-based dinner that\'s both satisfying and nutritious.',
        examples: [
            'Vegan chili with cornbread',
            'Stuffed portobello mushrooms',
            'Vegetable curry with jasmine rice',
            'Lentil bolognese with pasta'
        ],
        dietaryTags: ['vegan'],
        cuisineType: ['american', 'indian', 'mediterranean'],
        prepTime: 'elaborate',
        difficulty: 'advanced',
        calories: 510,
        macros: { protein: '18g', carbs: '78g', fats: '10g' }
    },
    
    // SNACKS
    {
        mealType: 'snack',
        instruction: 'Choose nutrient-dense snacks between meals. Aim for 150-200 calories.',
        examples: [
            'Apple with almond butter',
            'Greek yogurt with berries',
            'Mixed nuts and dried fruit',
            'Vegetable sticks with hummus',
            'Protein bar',
            'Hard-boiled eggs'
        ],
        dietaryTags: [],
        cuisineType: ['american'],
        prepTime: 'quick',
        difficulty: 'beginner',
        calories: 175,
        macros: { protein: '8g', carbs: '20g', fats: '8g' }
    },
    {
        mealType: 'snack',
        instruction: 'Healthy snack options to keep you energized throughout the day.',
        examples: [
            'Rice cakes with avocado',
            'Cottage cheese with fruit',
            'Trail mix',
            'Veggie chips with guacamole',
            'Protein shake',
            'Edamame'
        ],
        dietaryTags: [],
        cuisineType: ['american', 'asian'],
        prepTime: 'quick',
        difficulty: 'beginner',
        calories: 190,
        macros: { protein: '10g', carbs: '22g', fats: '9g' }
    }
];

/**
 * Filter meals based on user profile
 */
export const filterMeals = (
    meals: MealDefinition[],
    profile: {
        dietaryRestrictions: string[];
        cuisinePreferences: string[];
        mealPrepTime: string;
        cookingSkill: string;
    }
): MealDefinition[] => {
    return meals.filter(meal => {
        // Match dietary restrictions
        if (profile.dietaryRestrictions.length > 0) {
            const hasMatchingTag = profile.dietaryRestrictions.some(restriction => 
                meal.dietaryTags.includes(restriction)
            );
            if (!hasMatchingTag && profile.dietaryRestrictions.includes('vegan')) {
                // If vegan, must not contain animal products
                return false;
            }
            if (!hasMatchingTag && profile.dietaryRestrictions.includes('vegetarian')) {
                // If vegetarian, must not contain meat (but can have dairy/eggs)
                const hasMeat = meal.examples.some(ex => 
                    ['chicken', 'beef', 'turkey', 'pork', 'fish', 'salmon', 'tuna'].some(meat => 
                        ex.toLowerCase().includes(meat)
                    )
                );
                if (hasMeat) return false;
            }
        }
        
        // Match cuisine preferences (optional)
        if (profile.cuisinePreferences.length > 0) {
            const hasMatchingCuisine = profile.cuisinePreferences.some(cuisine =>
                meal.cuisineType.includes(cuisine)
            );
            if (!hasMatchingCuisine) return false;
        }
        
        // Match prep time
        if (profile.mealPrepTime === 'quick' && meal.prepTime !== 'quick') return false;
        if (profile.mealPrepTime === 'elaborate' && meal.prepTime === 'quick') return false;
        
        // Match cooking skill
        if (profile.cookingSkill === 'beginner' && meal.difficulty === 'advanced') return false;
        
        return true;
    });
};