import {serverHandler} from "./serverHandler"
import request from 'supertest';

// test GET /health -> should return 200, OK.
// test GET /users with a json mock -> should return 200, and the json mock.
// test GET /users without json mock -> should return 500
// test GET /users with invalid json -> should return 500
// test GET /users/:id with a json mock -> should return 200, and the whole user item
// test GET /users/:id with a non-existing user id -> should return 404
// test GET /users/:id with a invalid json -> should return 500
// test GET /whatever -> should return 404 with 'Not Found'
// test POST /health -> should return 404mo

describe('Server service tests', () => {
    test('it should return 200 with GET /health', async () => {
        const response = await request(serverHandler).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });
});
