# StreakUp Backend API

A Node.js/Express REST API built with TypeScript for the StreakUp fitness mobile application.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Server runs on `http://localhost:8000`

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── models/         # MongoDB schemas
├── routes/v1/     # API routes
├── services/       # Business logic
├── middlewares/    # Auth, validation, error handling
├── validators/     # Zod validation schemas
├── utils/          # Helper functions
└── types/          # TypeScript types
```

## 🔑 Environment Variables

Create a `.env` file:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/streakup
ACCESS_TOKEN_SECRET=your-secret-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id

# Optional
PORT=8000
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=15d
```

## 📚 API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout (requires auth)
- `POST /auth/google-login` - Google OAuth

### Plans
- `POST /plan/generate` - Generate 12-week plan (requires auth)
- `GET /plan/current` - Get current week (requires auth)
- `GET /plan/week?weekNumber=1` - Get specific week (requires auth)
- `GET /plan/all` - Get all weeks overview (requires auth)

### Workouts
- `GET /workout?weekNumber=1` - Get workouts for week (requires auth)
- `GET /workout/:id` - Get workout details (requires auth)
- `POST /workout/complete` - Complete workout (requires auth)
- `GET /workout/history/all` - Get workout history (requires auth)

### Meals
- `GET /meal?weekNumber=1` - Get meals for week (requires auth)
- `POST /meal/log` - Log meal (requires auth)
- `POST /meal/skip` - Skip meal (requires auth)
- `GET /meal/history/all` - Get meal history (requires auth)

### Progress
- `GET /progress/dashboard` - Get dashboard stats (requires auth)
- `GET /progress/stats` - Get detailed stats (requires auth)

### Health
- `GET /health` - Health check (public)

## 🔐 Authentication

Protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Tokens are obtained from `/auth/login` or `/auth/signup`:
- `accessToken` - Expires in 15 minutes
- `refreshToken` - Expires in 15 days

## 🛠 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 🗄 Database Models

- **User** - User accounts and authentication
- **Onboarding** - Questionnaire answers
- **UserPlan** - 12-week plans (one per week)
- **Workout** - Workout templates
- **Meal** - Meal templates
- **WorkoutLog** - Completed workouts
- **MealLog** - Logged meals
- **Progress** - User progress statistics
- **Achievement** - Unlocked badges

## 🏗 Architecture

```
Request → Route → Middleware → Controller → Service → Model → Database
```

- **Routes** - Define endpoints
- **Middlewares** - Auth, validation, error handling
- **Controllers** - Handle HTTP requests/responses
- **Services** - Business logic
- **Models** - Database operations

## 📦 Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Zod** - Validation
- **bcryptjs** - Password hashing

## 🐛 Troubleshooting

**MongoDB connection failed**
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running

**JWT validation errors**
- Verify token secrets in `.env`
- Check token hasn't expired

**Port already in use**
- Change `PORT` in `.env` or kill the process using port 8000

## 📝 License

ISC License
