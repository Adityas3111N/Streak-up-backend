# Backend Implementation Plan for StreakUp

## Overview

The backend needs to support a comprehensive health/fitness app with onboarding, personalized weekly plans, workout/meal tracking, progress monitoring, and achievements. The current backend has basic authentication but lacks all core business logic models and endpoints.

## Current State

- ✅ Express server with TypeScript
- ✅ Authentication (signup, login, Google OAuth, refresh tokens)
- ✅ Basic User model
- ❌ Missing: Onboarding, Plans, Workouts, Meals, Progress, Achievements

## Implementation Steps

### Phase 1: Database Models & Types

**1.1 User Model Enhancements** (`Backend/src/models/user.model.ts`)

- Add fields: `goalDate` (Date, optional), `onboardingCompleted` (boolean), `currentWeek` (number, default: 1)
- Add reference to UserPlan

**1.2 Onboarding Model** (`Backend/src/models/onboarding.model.ts`)

- Store 15 questionnaire answers
- Fields: `userId` (ref User), `goalDate` (Date, optional), `answers` (Map/Object), `completedAt` (Date)

**1.3 User Plan Model** (`Backend/src/models/userPlan.model.ts`)

- Fields: `userId` (ref User), `weekNumber` (1-12), `workouts` (Array), `meals` (Array), `status` (locked/unlocked/completed), `startDate`, `endDate`
- Store weekly workout schedule and meal additions

**1.4 Workout Model** (`Backend/src/models/workout.model.ts`)

- Fields: `name`, `duration`, `difficulty`, `day` (weekday), `exercises` (Array with sets, reps, rest, gifUrl), `weekNumber`, `workoutType`
- Template workouts that can be assigned to user plans

**1.5 Meal Model** (`Backend/src/models/meal.model.ts`)

- Fields: `day` (1-7), `mealType` (breakfast/lunch/dinner/snack), `instruction`, `examples` (Array), `weekNumber`
- Template meals that can be assigned to user plans

**1.6 Workout Log Model** (`Backend/src/models/workoutLog.model.ts`)

- Fields: `userId` (ref User), `workoutId` (ref Workout), `completedAt` (Date), `exercisesCompleted` (Array), `notes` (optional)

**1.7 Meal Log Model** (`Backend/src/models/mealLog.model.ts`)

- Fields: `userId` (ref User), `mealId` (ref Meal), `completedAt` (Date), `skipped` (boolean)

**1.8 Progress Model** (`Backend/src/models/progress.model.ts`)

- Fields: `userId` (ref User), `currentStreak` (number), `longestStreak` (number), `totalWorkoutsCompleted` (number), `totalMealsLogged` (number), `weeklyCompletionRate` (Map/Object), `lastActiveDate` (Date)

**1.9 Achievement Model** (`Backend/src/models/achievement.model.ts`)

- Fields: `userId` (ref User), `badgeId` (string), `unlockedAt` (Date), `badgeType` (streak/milestone/etc)

**1.10 Type Definitions** (`Backend/src/types/`)

- Create types for: `OnboardingAnswer`, `WorkoutExercise`, `WeeklyPlan`, `ProgressStats`, `AchievementBadge`

### Phase 2: Services Layer

**2.1 Plan Generation Service** (`Backend/src/services/planGeneration.service.ts`)

- Generate personalized 12-week plan based on onboarding answers
- Implement progression logic (Week 1: 3x/week 15min → Week 5+: higher intensity)
- Assign workouts and meals to each week

**2.2 Workout Service** (`Backend/src/services/workout.service.ts`)

- Get workouts for a specific week
- Track workout completion
- Calculate workout statistics

**2.3 Meal Service** (`Backend/src/services/meal.service.ts`)

- Get meals for a specific day/week
- Track meal logging
- Calculate meal statistics

**2.4 Progress Service** (`Backend/src/services/progress.service.ts`)

- Calculate streaks (daily active streak)
- Update completion rates
- Compute weekly/monthly statistics
- Check achievement eligibility

**2.5 Achievement Service** (`Backend/src/services/achievement.service.ts`)

- Define badge criteria (e.g., "7-day streak", "First workout", "Week 1 complete")
- Award badges automatically
- Retrieve user achievements

### Phase 3: Controllers & Routes

**3.1 Onboarding Controller** (`Backend/src/controllers/onboarding.controller.ts`)

- `submitAnswers` - Save questionnaire answers
- `getAnswers` - Retrieve saved answers (for review screen)

**3.2 Plan Controller** (`Backend/src/controllers/plan.controller.ts`)

- `generatePlan` - Create personalized plan after onboarding
- `getCurrentWeek` - Get current week's plan
- `getWeekPlan` - Get specific week's plan
- `getAllWeeks` - Get overview of all 12 weeks
- `unlockNextWeek` - Unlock next week when current week completed

**3.3 Workout Controller** (`Backend/src/controllers/workout.controller.ts`)

- `getWorkouts` - Get workouts for current/specific week
- `getWorkoutDetail` - Get single workout with exercises
- `completeWorkout` - Mark workout as completed
- `getWorkoutHistory` - Get completed workouts

**3.4 Meal Controller** (`Backend/src/controllers/meal.controller.ts`)

- `getMeals` - Get meals for current/specific week
- `getMealDetail` - Get single meal details
- `logMeal` - Log meal completion
- `skipMeal` - Skip a meal
- `getMealHistory` - Get logged meals

**3.5 Progress Controller** (`Backend/src/controllers/progress.controller.ts`)

- `getDashboard` - Get home screen stats (streak, completion, days until goal)
- `getProgressStats` - Get detailed progress metrics
- `getStreakCalendar` - Get streak visualization data
- `getWeeklyCompletion` - Get weekly completion chart data

**3.6 Achievement Controller** (`Backend/src/controllers/achievement.controller.ts`)

- `getAchievements` - Get user's unlocked badges
- `getAvailableBadges` - Get all possible badges

**3.7 Routes** (`Backend/src/routes/v1/`)

- Create route files: `onboarding.routes.ts`, `plan.routes.ts`, `workout.routes.ts`, `meal.routes.ts`, `progress.routes.ts`, `achievement.routes.ts`
- Register all routes in `app.ts`

### Phase 4: Validators

**4.1 Onboarding Validators** (`Backend/src/validators/onboarding.validator.ts`)

- Validate 15 answers structure
- Validate goal date format

**4.2 Plan Validators** (`Backend/src/validators/plan.validator.ts`)

- Validate week number (1-12)
- Validate plan generation requests

**4.3 Workout/Meal Validators** (`Backend/src/validators/tracking.validator.ts`)

- Validate workout completion data
- Validate meal logging data

### Phase 5: Business Logic & Utilities

**5.1 Date Utilities** (`Backend/src/utils/date.util.ts`)

- Calculate days until goal date
- Calculate current week number based on plan start date
- Determine if user was active today (for streak calculation)

**5.2 Plan Logic** (`Backend/src/utils/planLogic.util.ts`)

- Define workout progression rules
- Define meal progression rules
- Week unlocking logic

**5.3 Response Formatting** (`Backend/src/utils/response.util.ts`)

- Enhance response utilities if needed for consistent API responses

### Phase 6: Seed Data (Optional)

**6.1 Workout Templates** (`Backend/src/data/workoutTemplates.ts`)

- Pre-defined workout templates for different difficulty levels
- Exercise library with GIF URLs

**6.2 Meal Templates** (`Backend/src/data/mealTemplates.ts`)

- Pre-defined meal instructions and examples
- Meal variations by week

### Phase 7: Additional Features

**7.1 Notification Support** (Future)

- Endpoints for notification preferences
- Workout/meal reminder settings

**7.2 Flexibility Features**

- Rest day endpoints
- Catch-up week endpoints
- Easy week option endpoints

**7.3 Health Check** (`Backend/src/routes/v1/health.routes.ts`)

- Basic health check endpoint
- Database connection check

## File Structure

```
Backend/src/
├── models/
│   ├── user.model.ts (enhance)
│   ├── onboarding.model.ts (new)
│   ├── userPlan.model.ts (new)
│   ├── workout.model.ts (new)
│   ├── meal.model.ts (new)
│   ├── workoutLog.model.ts (new)
│   ├── mealLog.model.ts (new)
│   ├── progress.model.ts (new)
│   └── achievement.model.ts (new)
├── services/
│   ├── planGeneration.service.ts (new)
│   ├── workout.service.ts (new)
│   ├── meal.service.ts (new)
│   ├── progress.service.ts (new)
│   └── achievement.service.ts (new)
├── controllers/
│   ├── onboarding.controller.ts (new)
│   ├── plan.controller.ts (new)
│   ├── workout.controller.ts (new)
│   ├── meal.controller.ts (new)
│   ├── progress.controller.ts (new)
│   └── achievement.controller.ts (new)
├── routes/v1/
│   ├── onboarding.routes.ts (new)
│   ├── plan.routes.ts (new)
│   ├── workout.routes.ts (new)
│   ├── meal.routes.ts (new)
│   ├── progress.routes.ts (new)
│   └── achievement.routes.ts (new)
├── validators/
│   ├── onboarding.validator.ts (new)
│   ├── plan.validator.ts (new)
│   └── tracking.validator.ts (new)
├── utils/
│   ├── date.util.ts (new)
│   └── planLogic.util.ts (new)
└── types/
    └── plan.types.ts (new)
```

## Key Considerations

- All endpoints (except onboarding) require authentication (`isAuthenticated` middleware)
- Plan generation happens once after onboarding completion
- Streak calculation: user must log at least one workout OR meal per day
- Week unlocking: automatically unlock next week when current week is 80%+ complete
- Progress updates happen automatically when workouts/meals are logged
- Use MongoDB references for relationships (userId, workoutId, mealId)
- Implement proper error handling and validation throughout