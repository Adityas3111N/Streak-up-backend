Downward-only flow ensures modular, testable logic.

---

## 🧠 Example Execution (Register)
1. Request hits `/api/v1/auth/register`
2. Payload validated via `auth.validator.ts`
3. Controller calls auth service
4. Service hashes password (bcrypt) + saves user
5. Model (`user.model.ts`) writes to MongoDB
6. JWT created via `jwt.util.ts`
7. Response sent via `response.util.ts`

---

## ⚡ Example API Schema
**POST /api/v1/auth/login**
```json
{
  "email": "user@example.com",
  "password": "123456"
}


{
  "success": true,
  "data": {
    "user": { "id": "abc123", "email": "user@example.com" },
    "token": "jwt_token_here"
  }
}


🧠 Notes for AI Tools

app.ts + index.ts are entry points.
Controllers depend on services; services depend on models.
Validation strictly precedes DB operations.
All token logic is abstracted in jwt.util.ts.
Errors bubble through error.middleware.ts.


🧩 Technologies

Node.js, Express 5, TypeScript, MongoDB (Mongoose), JWT, Passport (Google OAuth2), Zod, Jest, Supertest

//Package.json

{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write .",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cookie-parse": "^0.4.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "google-auth-library": "^10.4.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.18.2",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.9",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/mongoose": "^5.11.96",
    "@types/node": "^24.6.0",
    "@types/passport": "^1.0.17",
    "@types/passport-google-oauth20": "^2.0.16",
    "eslint": "^9.36.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.4",
    "jest": "^30.2.0",
    "nodemon": "^3.1.10",
    "prettier": "^3.6.2",
    "supertest": "^7.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.2"
  }
}
