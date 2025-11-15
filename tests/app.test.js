import request from 'supertest';
import app from '../src/app.js'; // Express app instance

describe('GET /api', () => {
  it('should return API is working', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('API is working!');
  });
});
// 1) all tests at once -npm test
// single file test - npx jest tests/user.test.js
//have a different test db - MONGO_URI=mongodb://localhost:27017/testdb
//Use setup/teardown hooks

// 2)
// beforeAll() → connect to DB

// beforeEach() → optionally seed data

// afterEach() → clean up data (e.g., User.deleteMany())

// afterAll() → close DB connection
// This ensures clean state for each test.

// 3) 
// Test in layers

// Unit tests – test functions in services/ or utils/ independently.

// Integration tests – test controllers with database & models using Supertest.

// End-to-end tests (optional) – test full API flow or multiple endpoints.

// 4) 
