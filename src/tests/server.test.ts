import { Server } from 'http';
import { initServer } from '../utils/initServer';
import { getDataFromFile } from '../utils/getDataFromFile';
import request from 'supertest';
import { Express } from 'express';

describe('server tests', () => {
    let app: Express;
    let testData: any;
    let serverInstance: Server;

    beforeAll(() => {
        // Load test data and start the server
        testData = getDataFromFile('./src/tests/testData.json');
        const { app: initializedApp, server } = initServer(3001);
        app = initializedApp;
        serverInstance = server;

    });

    afterAll(() => {
        serverInstance.close();
    });

    test('GET /users returns an array of users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(testData);
    });

    test('GET /health returns 200 OK', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.text).toBe('OK');
    });

    test('GET /users/:id returns the correct user', async () => {
        const userId = testData.users[0].id;
        const expectedUser = testData.users.find((user: any) => user.id === userId);

        const response = await request(app).get(`/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toEqual(expectedUser);
    });

    test('GET /users/:id with non-existing id returns 404', async () => {
        const response = await request(app).get('/users/9999');
        expect(response.status).toBe(404);
        expect(response.text).toBe('User not found');
    });
});
