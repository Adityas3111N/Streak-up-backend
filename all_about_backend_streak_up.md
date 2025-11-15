# Complete Backend Documentation for StreakUp

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Architecture Pattern](#architecture-pattern)
5. [Configuration](#configuration)
6. [Database Models](#database-models)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Authorization](#authentication--authorization)
9. [Services Layer](#services-layer)
10. [Utilities & Helpers](#utilities--helpers)
11. [Middleware](#middleware)
12. [Type Definitions](#type-definitions)
13. [Data Libraries](#data-libraries)
14. [Testing](#testing)
15. [Environment Variables](#environment-variables)
16. [Running the Project](#running-the-project)

---

## Overview

**StreakUp Backend** is a Node.js/Express REST API built with TypeScript that powers a health and fitness mobile application. The backend handles user authentication, personalized workout/meal plan generation, progress tracking, achievements, and streak management.

### Key Features
- **Authentication**: JWT-based auth with Google OAuth support
- **Onboarding**: 15-question questionnaire for personalized plan creation
- **12-Week Plans**: Auto-generated workout and meal plans based on user preferences
- **Progress Tracking**: Workout completion, meal logging, streak calculation
- **Achievements**: Badge system for milestones and streaks
- **Week Progression**: Automatic week unlocking based on completion rates

---

## Technology Stack

### Core Dependencies
- **Express.js 5.1.0**: Web framework
- **TypeScript 5.9.2**: Type-safe JavaScript
- **Mongoose 8.18.2**: MongoDB ODM
- **jsonwebtoken 9.0.2**: JWT token generation/verification
- **bcryptjs 3.0.2**: Password hashing
- **Zod 4.1.11**: Schema validation
- **passport & passport-google-oauth20**: Google OAuth integration
- **google-auth-library**: Google ID token verification

### Development Tools
- **ts-node**: TypeScript execution
- **nodemon**: Auto-reload during development
- **Jest**: Testing framework
- **ESLint & Prettier**: Code quality and formatting

---

## Project Structure

```
Backend/
├── src/
│   ├── index.ts                 # Entry point - DB connection & server start
│   ├── app.ts                   # Express app configuration & route registration
│   ├── config/
│   │   └── env.config.ts        # Environment variable validation with Zod
│   ├── controllers/             # Request handlers (business logic endpoints)
│   │   ├── auth.controller.ts
│   │   ├── onboarding.controller.ts
│   │   ├── plan.controller.ts
│   │   ├── workout.controller.ts
│   │   ├── meal.controller.ts
│   │   ├── progress.controller.ts
│   │   ├── achievement.controller.ts
│   │   └── health.controller.ts
│   ├── models/                  # Mongoose schemas
│   │   ├── user.model.ts
│   │   ├── onboarding.model.ts
│   │   ├── userPlan.model.ts
│   │   ├── workout.model.ts
│   │   ├── meal.model.ts
│   │   ├── workoutLog.model.ts
│   │   ├── mealLog.model.ts
│   │   ├── progress.model.ts
│   │   └── achievement.model.ts
│   ├── routes/v1/               # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── onboarding.routes.ts
│   │   ├── plan.routes.ts
│   │   ├── workout.routes.ts
│   │   ├── meal.routes.ts
│   │   ├── progress.routes.ts
│   │   ├── achievement.routes.ts
│   │   └── health.routes.ts
│   ├── services/                # Business logic layer
│   │   ├── planGeneration.service.ts
│   │   ├── workout.service.ts
│   │   ├── meal.service.ts
│   │   ├── progress.service.ts
│   │   └── acheivement.service.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # JWT authentication middleware
│   │   ├── error.middleware.ts  # Global error handler
│   │   └── validate.middleware.ts # Zod validation middleware
│   ├── validators/              # Zod schemas for request validation
│   │   ├── auth.validator.ts
│   │   ├── onboarding.validator.ts
│   │   ├── plan.validator.ts
│   │   └── tracking.validator.ts
│   ├── utils/                   # Helper functions
│   │   ├── jwt.util.ts          # Token generation/verification
│   │   ├── response.util.ts     # Standardized API responses
│   │   ├── date.util.ts         # Date calculations
│   │   ├── planLogic.util.ts    # Plan generation logic
│   │   ├── workoutGenerator.util.ts
│   │   ├── mealGenerator.util.ts
│   │   └── userProfile.util.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── user.types.ts
│   │   ├── token.types.ts
│   │   └── plan.types.ts
│   └── data/                    # Seed data/templates
│       ├── exerciseLibrary.ts   # Exercise definitions
│       └── mealLibrary.ts        # Meal templates
├── tests/                       # Test files
│   ├── setup.ts
│   └── app.test.js
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env                         # Environment variables (not in repo)
```

---

## Architecture Pattern

The backend follows a **layered MVC architecture**:

1. **Routes Layer** (`routes/v1/`): Define endpoints and HTTP methods
2. **Middleware Layer** (`middlewares/`): Authentication, validation, error handling
3. **Controller Layer** (`controllers/`): Handle HTTP requests/responses, call services
4. **Service Layer** (`services/`): Business logic, data processing
5. **Model Layer** (`models/`): Database schemas and Mongoose models

**Request Flow:**
```
Request → Route → Middleware (auth/validation) → Controller → Service → Model → Database
                                                                    ↓
Response ← Route ← Controller ← Service ← Model ← Database
```

---

## Configuration

### Environment Configuration (`src/config/env.config.ts`)

Uses **Zod** to validate and parse environment variables at startup:

**Required Variables:**
- `MONGODB_URI`: MongoDB connection string
- `ACCESS_TOKEN_SECRET`: Secret for JWT access tokens (min 32 chars)
- `REFRESH_TOKEN_SECRET`: Secret for JWT refresh tokens (min 32 chars)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID

**Optional Variables:**
- `PORT`: Server port (default: 8000)
- `CORS_ORIGIN`: Allowed CORS origin
- `ACCESS_TOKEN_EXPIRY`: Access token expiry (default: "15m")
- `REFRESH_TOKEN_EXPIRY`: Refresh token expiry (default: "15d")
- `CLOUDINARY_*`: Cloudinary config for file uploads
- `GOOGLE_CLIENT_SECRET`: Google OAuth secret
- `GOOGLE_CALLBACK_URL`: Google OAuth callback URL

The config exports validated environment variables that can be imported anywhere.

---

## Database Models

### 1. User Model (`user.model.ts`)

**Fields:**
- `name`: String (required)
- `userName`: String (unique, indexed)
- `email`: String (required, unique)
- `password`: String (hashed with bcrypt, optional for OAuth users)
- `socialProvider`: String (e.g., "google")
- `socialId`: String (OAuth provider user ID)
- `refreshToken`: String (stored refresh token)
- `goalDate`: Date (optional target date)
- `onboardingCompleted`: Boolean (default: false)
- `currentWeek`: Number (1-12, default: 1)
- `createdAt`, `updatedAt`: Auto-timestamps

**Methods:**
- `comparePassword(candidatePassword)`: Compare password with hashed version

**Indexes:**
- `userName`: Text index for search
- `{socialId, socialProvider}`: Compound index for OAuth lookups

**Pre-save Hook:**
- Automatically hashes password before saving (skips for OAuth users)

---

### 2. Onboarding Model (`onboarding.model.ts`)

Stores user questionnaire answers.

**Fields:**
- `userId`: ObjectId (ref: User, unique)
- `goalDate`: Date (optional)
- `answers`: Array of `{questionId: string, answer: mixed}`
- `completedAt`: Date

**Indexes:**
- `userId`: Unique index

---

### 3. UserPlan Model (`userPlan.model.ts`)

Represents a user's weekly plan (12 weeks total).

**Fields:**
- `userId`: ObjectId (ref: User)
- `weekNumber`: Number (1-12)
- `workouts`: Array of ObjectIds (ref: Workout)
- `meals`: Array of ObjectIds (ref: Meal)
- `status`: Enum ['locked', 'unlocked', 'completed']
- `startDate`: Date
- `endDate`: Date

**Indexes:**
- `{userId, weekNumber}`: Compound unique index

---

### 4. Workout Model (`workout.model.ts`)

Template workout definitions.

**Fields:**
- `name`: String
- `duration`: Number (minutes)
- `difficulty`: Enum ['beginner', 'intermediate', 'advanced']
- `day`: Number (0-6, Sunday-Saturday)
- `exercises`: Array of `{name, sets, reps, rest, gifUrl, notes}`
- `weekNumber`: Number (1-12)
- `workoutType`: Enum ['strength', 'cardio', 'flexibility', 'mixed']

**Indexes:**
- `{weekNumber, day}`: Compound index
- `difficulty`: Index

---

### 5. Meal Model (`meal.model.ts`)

Template meal definitions.

**Fields:**
- `day`: Number (1-7)
- `mealType`: Enum ['breakfast', 'lunch', 'dinner', 'snack']
- `instruction`: String
- `examples`: Array of strings
- `weekNumber`: Number (1-12)

**Indexes:**
- `{weekNumber, day, mealType}`: Compound index

---

### 6. WorkoutLog Model (`workoutLog.model.ts`)

Tracks completed workouts.

**Fields:**
- `userId`: ObjectId (ref: User)
- `workoutId`: ObjectId (ref: Workout)
- `completedAt`: Date
- `exercisesCompleted`: Array of `{exerciseName, setsCompleted, repsCompleted}`
- `notes`: String (optional)

**Indexes:**
- `userId`: Index
- `completedAt`: Index
- `{userId, completedAt}`: Compound index for history queries

---

### 7. MealLog Model (`mealLog.model.ts`)

Tracks logged meals.

**Fields:**
- `userId`: ObjectId (ref: User)
- `mealId`: ObjectId (ref: Meal)
- `completedAt`: Date
- `skipped`: Boolean (default: false)

**Indexes:**
- `userId`: Index
- `completedAt`: Index
- `{userId, completedAt}`: Compound index for history queries

---

### 8. Progress Model (`progress.model.ts`)

User progress statistics.

**Fields:**
- `userId`: ObjectId (ref: User, unique)
- `currentStreak`: Number (default: 0)
- `longestStreak`: Number (default: 0)
- `totalWorkoutsCompleted`: Number (default: 0)
- `totalMealsLogged`: Number (default: 0)
- `weeklyCompletionRate`: Object (weekNumber -> percentage)
- `lastActiveDate`: Date

**Indexes:**
- `userId`: Unique index

---

### 9. Achievement Model (`achievement.model.ts`)

User unlocked badges/achievements.

**Fields:**
- `userId`: ObjectId (ref: User)
- `badgeId`: String
- `unlockedAt`: Date
- `badgeType`: Enum ['streak', 'milestone', 'week', 'workout', 'meal']

**Indexes:**
- `{userId, badgeId}`: Compound unique index
- `{userId, unlockedAt}`: Compound index for sorting

---

## API Endpoints

### Base URL: `/api/v1`

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/signup` | No | Create new user account |
| POST | `/login` | No | Login with email/username & password |
| POST | `/refresh` | No | Refresh access token |
| POST | `/logout` | Yes | Logout and invalidate tokens |
| POST | `/google-login` | No | Google OAuth login |

**Request/Response Examples:**

**Signup:**
```json
POST /api/v1/auth/signup
{
  "name": "John Doe",
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "userName": "johndoe"
  }
}
```

---

### Onboarding Routes (`/api/v1/onboarding`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/submit` | Yes | Submit onboarding questionnaire |
| GET | `/answers` | Yes | Get saved onboarding answers |

---

### Plan Routes (`/api/v1/plan`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/generate` | Yes | Generate personalized 12-week plan |
| GET | `/current` | Yes | Get current week's plan |
| GET | `/week?weekNumber=1` | Yes | Get specific week's plan |
| GET | `/all` | Yes | Get overview of all 12 weeks |
| POST | `/unlock` | Yes | Manually unlock next week |

---

### Workout Routes (`/api/v1/workout`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/week?weekNumber=1` | Yes | Get workouts for a week |
| GET | `/detail/:workoutId` | Yes | Get workout details |
| POST | `/complete` | Yes | Mark workout as completed |
| GET | `/history` | Yes | Get workout completion history |

---

### Meal Routes (`/api/v1/meal`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/week?weekNumber=1` | Yes | Get meals for a week |
| GET | `/detail/:mealId` | Yes | Get meal details |
| POST | `/log` | Yes | Log a meal |
| POST | `/skip` | Yes | Skip a meal |
| GET | `/history` | Yes | Get meal logging history |

---

### Progress Routes (`/api/v1/progress`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/dashboard` | Yes | Get dashboard stats (streak, completion, days until goal) |
| GET | `/stats` | Yes | Get detailed progress statistics |
| GET | `/streak-calendar` | Yes | Get streak calendar data |
| GET | `/weekly-completion` | Yes | Get weekly completion chart data |

---

### Achievement Routes (`/api/v1/achievement`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | Yes | Get user's unlocked achievements |
| GET | `/available` | Yes | Get all available badges |

---

### Health Routes (`/api/v1/health`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Health check endpoint |

---

## Authentication & Authorization

### JWT Token Flow

1. **Login/Signup**: User receives `accessToken` (15min expiry) and `refreshToken` (15days expiry)
2. **Protected Routes**: Client sends `accessToken` in:
   - `Authorization: Bearer <token>` header, OR
   - `accessToken` in request body, OR
   - `accessToken` cookie
3. **Token Refresh**: When access token expires, client uses refresh token to get new tokens
4. **Logout**: Server invalidates refresh token in database

### Authentication Middleware (`isAuthenticated`)

Located in `src/middlewares/auth.middleware.ts`:

- Extracts token from header, body, or cookies
- Verifies token using `verifyAccessToken()`
- Attaches decoded payload to `req.auth` (contains `id` and `email`)
- Returns 401 if no token, 403 if invalid/expired

**Usage:**
```typescript
router.get("/protected", isAuthenticated, controllerFunction);
```

### Google OAuth Flow

1. Mobile app gets Google ID token
2. Backend verifies token with `google-auth-library`
3. If user exists (by email or socialId), login
4. If new user, create account with auto-generated username
5. Return JWT tokens

---

## Services Layer

Services contain business logic and are called by controllers.

### Plan Generation Service (`planGeneration.service.ts`)

- Generates personalized 12-week plan based on onboarding answers
- Creates workouts and meals for each week
- Assigns workouts to specific days based on frequency
- Progression logic: Week 1-2 (15min), Week 3-4 (20min), Week 5-7 (25min), Week 8-12 (30min)

### Workout Service (`workout.service.ts`)

- `getWorkoutsForWeek()`: Get workouts by week number
- `getWorkoutById()`: Get workout details
- `getWorkoutsForUserWeek()`: Get user's assigned workouts
- `completeWorkout()`: Log workout completion
- `getWorkoutHistory()`: Get user's workout history
- `getWorkoutStats()`: Calculate workout statistics

### Meal Service (`meal.service.ts`)

- Similar functions for meal operations
- Meal logging and history tracking

### Progress Service (`progress.service.ts`)

- `updateStreak()`: Calculate and update daily streak
- `updateWeeklyCompletion()`: Calculate week completion percentage
- `getProgressStats()`: Aggregate progress data
- Streak logic: User must log at least one workout OR meal per day

### Achievement Service (`acheivement.service.ts`)

- `checkAndAwardBadges()`: Check achievement criteria and award badges
- Badge types: streak milestones, week completion, first workout, etc.

---

## Utilities & Helpers

### JWT Utilities (`utils/jwt.util.ts`)

- `generateAccessToken(payload)`: Create access token
- `generateRefreshToken(payload)`: Create refresh token
- `verifyAccessToken(token)`: Verify and decode access token
- `verifyRefreshToken(token)`: Verify and decode refresh token
- `createPayload(user)`: Create token payload from user object

### Response Utilities (`utils/response.util.ts`)

- `success(res, data, status)`: Send success response
- `error(res, message, status)`: Send error response
- `validatePassword(user, candidate)`: Validate password

### Date Utilities (`utils/date.util.ts`)

- Date calculations for streaks, week numbers, goal dates

### Plan Logic Utilities (`utils/planLogic.util.ts`)

- `getWorkoutFrequency(answers)`: Determine workout frequency from onboarding
- `getWorkoutDuration(weekNumber)`: Get duration based on week
- `getWorkoutDifficulty(weekNumber)`: Get difficulty progression
- `getWorkoutDays(frequency)`: Distribute workouts across week
- `calculateWeekCompletion()`: Calculate week completion percentage
- `shouldUnlockNextWeek()`: Check if next week should unlock

### Generator Utilities

- `workoutGenerator.util.ts`: Generate workouts from exercise library
- `mealGenerator.util.ts`: Generate meals from meal library
- `userProfile.util.ts`: User profile utilities

---

## Middleware

### 1. Authentication Middleware (`auth.middleware.ts`)

- `isAuthenticated`: Verifies JWT token and attaches user to request

### 2. Validation Middleware (`validate.middleware.ts`)

- Uses Zod schemas to validate request body/query
- Returns 400 with validation errors if invalid

**Usage:**
```typescript
router.post("/endpoint", validate(zodSchema), controller);
```

### 3. Error Middleware (`error.middleware.ts`)

- Global error handler (must be last middleware)
- Handles ZodError, Mongoose errors, and generic errors
- Returns standardized error responses

---

## Type Definitions

### User Types (`types/user.types.ts`)

```typescript
interface UserInterface extends Document {
  _id: string;
  id: string;
  name: string;
  userName: string;
  email: string;
  password?: string;
  socialProvider?: string;
  socialId?: string;
  refreshToken?: string | null;
  goalDate?: Date;
  onboardingCompleted?: boolean;
  currentWeek?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
```

### Plan Types (`types/plan.types.ts`)

```typescript
interface OnboardingAnswer {
  questionId: string;
  answer: string | number | boolean | string[];
}

interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  rest: number;
  gifUrl?: string;
  notes?: string;
}

interface WeeklyPlan {
  weekNumber: number;
  workouts: string[];
  meals: string[];
  status: 'locked' | 'unlocked' | 'completed';
  startDate?: Date;
  endDate?: Date;
}
```

### Token Types (`types/token.types.ts`)

```typescript
interface TokenPayload {
  id: string;
  email: string;
}
```

---

## Data Libraries

### Exercise Library (`data/exerciseLibrary.ts`)

- Comprehensive exercise definitions with:
  - Equipment needs (none/home/gym)
  - Difficulty levels
  - Target muscles
  - Workout types
  - Impact levels
  - Goals alignment
  - Alternative exercises

### Meal Library (`data/mealLibrary.ts`)

- Meal templates with:
  - Meal types (breakfast/lunch/dinner/snack)
  - Instructions
  - Example dishes
  - Dietary tags
  - Cuisine types
  - Prep time
  - Difficulty
  - Calorie estimates
  - Macro breakdowns

---

## Testing

### Jest Configuration (`jest.config.js`)

- Test environment: Node.js
- Test files: `tests/**/*.test.ts`
- Setup file: `tests/setup.ts`
- Coverage from: `src/**/*.ts`

**Run Tests:**
```bash
npm test
```

---

## Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/streakup
ACCESS_TOKEN_SECRET=your-secret-key-min-32-characters-long
REFRESH_TOKEN_SECRET=your-refresh-secret-key-min-32-characters-long
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Optional
PORT=8000
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=15d

# Google OAuth (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

# Cloudinary (optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_CLOUD_KEY=your-api-key
CLOUDINARY_CLOUD_SECRET=your-api-secret
```

---

## Running the Project

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
cd Backend
npm install
```

### Development

```bash
npm run dev     # Start with ts-node and auto-reload
```

### Production

```bash
npm run build   # Compile TypeScript to JavaScript
npm start       # Run compiled code from dist/
```

### Other Scripts

```bash
npm run lint    # Run ESLint
npm run format  # Format code with Prettier
npm test        # Run tests
```

### Server Startup Flow

1. `index.ts` loads environment variables via `dotenv`
2. Validates environment variables using Zod (`env.config.ts`)
3. Connects to MongoDB
4. Starts Express server on configured PORT
5. App listens for requests

---

## Key Design Decisions

### 1. Token Storage
- Refresh tokens stored in database for revocation
- Access tokens not stored (stateless)

### 2. Week Unlocking
- Automatic unlocking when current week reaches 80%+ completion
- Can be manually unlocked via API

### 3. Streak Calculation
- User must log at least one workout OR meal per day
- Streak breaks if no activity for a day

### 4. Plan Generation
- One-time generation after onboarding
- Cannot regenerate (prevents data loss)

### 5. Response Format
- Consistent success/error response structure
- Error messages user-friendly (no stack traces in production)

---

## Common Patterns

### Controller Pattern

```typescript
export const controllerFunction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth?.id;
    if (!userId) return error(res, "Unauthorized", 401);
    
    // Business logic here
    
    return success(res, { data }, 200);
  } catch (err: any) {
    console.error(err);
    return error(res, err.message || "Server error", 500);
  }
};
```

### Service Pattern

```typescript
export const serviceFunction = async (params) => {
  // Database operations
  const result = await Model.find({ ... });
  return result;
};
```

### Route Pattern

```typescript
router.post("/endpoint", 
  isAuthenticated, 
  validate(schema), 
  controllerFunction
);
```

---

## Security Considerations

1. **Password Hashing**: bcryptjs with salt rounds (10)
2. **JWT Secrets**: Minimum 32 characters, stored in environment
3. **Input Validation**: Zod schemas for all inputs
4. **CORS**: Configured for specific origins
5. **Request Size Limits**: 10kb for JSON and URL-encoded

### Areas for Improvement

- Rate limiting for authentication endpoints
- CSRF protection
- Request logging
- Error monitoring (e.g., Sentry)
- Database connection pooling configuration
- Token blacklisting for logout

---

## API Response Format

### Success Response

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

or

```json
{
  "message": "Success",
  "data": { ... }
}
```

### Error Response

```json
{
  "message": "Error message here"
}
```

### Validation Error Response

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

---

## Database Relationships

```
User (1) ──→ (1) Onboarding
User (1) ──→ (12) UserPlan (one per week)
User (1) ──→ (N) WorkoutLog
User (1) ──→ (N) MealLog
User (1) ──→ (1) Progress
User (1) ──→ (N) Achievement

UserPlan (N) ──→ (N) Workout (via workouts array)
UserPlan (N) ──→ (N) Meal (via meals array)

WorkoutLog (N) ──→ (1) Workout
MealLog (N) ──→ (1) Meal
```

---

## Future Enhancements

1. **Notifications**: Push notifications for workout/meal reminders
2. **Social Features**: Friend connections, leaderboards
3. **Analytics**: Detailed progress charts and insights
4. **Custom Workouts**: User-created workout plans
5. **Meal Planning**: Advanced meal planning with shopping lists
6. **Integration**: Fitness tracker sync (Apple Health, Google Fit)

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGODB_URI` in `.env`
   - Ensure MongoDB is running

2. **JWT Validation Errors**
   - Verify token secrets in `.env`
   - Check token expiry settings

3. **Validation Errors**
   - Check request body matches Zod schema
   - Verify required fields are present

4. **TypeScript Compilation Errors**
   - Run `npm run build` to see detailed errors
   - Check `tsconfig.json` settings

---

## Contact & Support

For questions about the backend architecture, refer to:
- `Backend/Readme.md` - Basic folder structure
- `Backend/backend_plan.md` - Implementation plan
- `Backend/ai.context.md` - AI context file

---

**Last Updated**: See git commit history for latest changes
**Version**: 1.0.0








