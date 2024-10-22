import {serverHandler} from "./serverHandler"
import request from 'supertest';
import * as fs from 'fs';

// test GET /health -> should return 200, OK.
// test GET /users with a json mock -> should return 200, and the json mock.
// test GET /users without json mock -> should return 500
// test GET /users with invalid json -> should return 500
// test GET /users/:id with a json mock -> should return 200, and the whole user item
// test GET /users/:id with a non-existing user id -> should return 404
// test GET /users/:id with a invalid json -> should return 500
// test GET /whatever -> should return 404 with 'Not Found'
// test POST /health -> should return 404mo


jest.mock('fs');


describe('Server service tests', () => {
    it('should return 200 with GET /health', async () => {
        const response = await request(serverHandler).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });
    it('should return 404 on GET /whatever', async () => {
        const response = await request(serverHandler).get('/whatever');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });
    it('should return 404 on POST /health', async () => {
        const response = await request(serverHandler).post('/health');
        expect(response.status).toBe(404);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test: GET /users with a valid JSON mock -> should return 200 and the JSON mock
    it('should return 200 and the JSON mock on GET /users', async () => {
        const mockData = {users: [{id: 1, name: 'John Doe'}]};
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

        const response = await request(serverHandler).get('/users');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(mockData);
    });

    it('should return 500 if there is no JSON mock for GET /users', async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(undefined);

        const response = await request(serverHandler).get('/users');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });

    it('should return 500 if the JSON is invalid for GET /users', async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

        const response = await request(serverHandler).get('/users');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });

    it('should return 200 and the user item on GET /users/:id', async () => {
        const mockData = { users: [{ id: 1, name: 'John Doe' }] };
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

        const response = await request(serverHandler).get('/users/1');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(mockData.users[0]);
    });

    it('should return 404 if the user is not found on GET /users/:id', async () => {
        const mockData = { users: [{ id: 1, name: 'John Doe' }] };
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

        const response = await request(serverHandler).get('/users/999');
        expect(response.status).toBe(404);
        expect(response.text).toBe('User not found');
    });

    it('should return 500 if the JSON is invalid for GET /users/:id', async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');

        const response = await request(serverHandler).get('/users/1');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });

});

