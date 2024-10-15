import { test, expect } from '@playwright/test';
import { UserSchema, UserListSchema } from './schemas';

test.describe('Basic api tests', () => {

    // The following are few custom validation functions
    // They validate contents of responses
    const validateUserList = (res: any) => {
        expect(res).toMatchObject(
            { users: [ { name: 'Alice' }, { name: 'Bob' } ] }
        );
        expect(res.users.length).toBe(2);
    }
    
    const validateUser = (res: any) => {
        expect(res).toMatchObject(
            { name: 'Bob' }
        );
    }

    // The following is the data for all test cases
    const TEST_CASES = [
        {
            name: "Get All Users",
            url: "/users",
            method: "GET",
            expectedStatus: 200,
            schema: UserListSchema,
            customValidation: validateUserList,
        },
        {
            name: "Get Specific User",
            url: "/users/2",
            method: "GET",
            expectedStatus: 200,
            schema: UserSchema,
            customValidation: validateUser,
        },
        {
            name: "Get Nonexistent Endpoint",
            url: "/nonexistent",
            method: "GET",
            expectedStatus: 404,
        },
        {
            name: "Get Nonexistent user",
            url: "/users/22",
            method: "GET",
            expectedStatus: 404,
        },
        {
            name: "Create user - unsupported",
            url: "/users",
            method: "POST",
            expectedStatus: 404,
        },
        {
            name: "Update user - unsupported",
            url: "/users/2",
            method: "PUT",
            expectedStatus: 404,
        },
        {
            name: "DELETE user - unsupported",
            url: "/users/2",
            method: "DELETE",
            expectedStatus: 404,
        },
        {
            name: "Get Health",
            url: "/health",
            method: "GET",
            expectedStatus: 200,
            expectedNonJsonText: "OK",
        },
    ]
    for (const params of TEST_CASES) {
        test(`Scenario: ${params.name}`, async ({ request}) => {
            // Send Request
            let response;    
            switch (params.method) {
                case 'GET':
                    response = await request.get(params.url);
                    break;
                case 'POST':
                    response = await request.post(params.url);
                    break;
                case 'PUT':
                    response = await request.put(params.url);
                    break;
                case 'DELETE':
                    response = await request.delete(params.url);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${params.method}`);
            }
    
            // Check Status Code
            expect(response.status()).toBe(params.expectedStatus);

            // Validate Schema, optional param
            if (params.schema !== undefined) {
                const res = await response.json();
                params.schema.parse(res);
            }

            // Additional custom validation, optional param
            if (params.customValidation !== undefined) {
                const res = await response.json();
                params.customValidation(res);
            }

            // Some endpoints return plain text, optional param
            if (params.expectedNonJsonText !== undefined) {
                const actualText = await response.text();
                expect(actualText).toBe(params.expectedNonJsonText);
            }
        });
    }
});
