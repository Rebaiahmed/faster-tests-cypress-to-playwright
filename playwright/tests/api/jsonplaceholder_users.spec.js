const { test, expect } = require('@playwright/test');

test.describe('JSONPlaceholder API - Users Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Should get all users', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(10);
    });

    test('Should get a single user by ID', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('id', 1);
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('email');
    });

    test('Should validate user structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`);
        const body = await response.json();
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('username');
        expect(body).toHaveProperty('email');
        expect(body).toHaveProperty('address');
        expect(body).toHaveProperty('phone');
        expect(body).toHaveProperty('website');
        expect(body).toHaveProperty('company');
    });

    test('Should validate user address structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`);
        const body = await response.json();
        expect(body.address).toHaveProperty('street');
        expect(body.address).toHaveProperty('suite');
        expect(body.address).toHaveProperty('city');
        expect(body.address).toHaveProperty('zipcode');
        expect(body.address).toHaveProperty('geo');
    });

    test('Should validate geo coordinates', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`);
        const body = await response.json();
        expect(body.address.geo).toHaveProperty('lat');
        expect(body.address.geo).toHaveProperty('lng');
    });

    test('Should validate company structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`);
        const body = await response.json();
        expect(body.company).toHaveProperty('name');
        expect(body.company).toHaveProperty('catchPhrase');
        expect(body.company).toHaveProperty('bs');
    });

    test('Should get user posts', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1/posts`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
    });

    test('Should get user albums', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1/albums`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
    });

    test('Should get user todos', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1/todos`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
    });

    test('Should validate email format', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users`);
        const body = await response.json();
        body.forEach(user => {
            expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });

    test('Should create a new user', async ({ request }) => {
        const response = await request.post(`${baseUrl}/users`, {
            data: {
                name: 'Test User',
                username: 'testuser',
                email: 'test@example.com'
            }
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.name).toBe('Test User');
    });

    test('Should update a user', async ({ request }) => {
        const response = await request.put(`${baseUrl}/users/1`, {
            data: {
                name: 'Updated Name',
                email: 'updated@example.com'
            }
        });
        expect(response.status()).toBe(200);
    });

    test('Should delete a user', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/users/1`);
        expect(response.status()).toBe(200);
    });

    test('Should have unique user IDs', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users`);
        const body = await response.json();
        const ids = body.map(user => user.id);
        const uniqueIds = [...new Set(ids)];
        expect(ids.length).toBe(uniqueIds.length);
    });

    test('Should have unique usernames', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users`);
        const body = await response.json();
        const usernames = body.map(user => user.username);
        const uniqueUsernames = [...new Set(usernames)];
        expect(usernames.length).toBe(uniqueUsernames.length);
    });

    test('Should validate all users have websites', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users`);
        const body = await response.json();
        body.forEach(user => {
            expect(typeof user.website).toBe('string');
            expect(user.website).not.toBe('');
        });
    });

    test('Should filter users by name', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users?name=Leanne Graham`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
    });

    test('Should validate phone numbers exist', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users`);
        const body = await response.json();
        body.forEach(user => {
            expect(typeof user.phone).toBe('string');
            expect(user.phone).not.toBe('');
        });
    });

    test('Should return user with valid JSON', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`);
        const body = await response.json();
        expect(typeof body).toBe('object');
    });

    test('Should handle multiple user requests', async ({ request }) => {
        const ids = [1, 2, 3, 4, 5];
        for (const id of ids) {
            const response = await request.get(`${baseUrl}/users/${id}`);
            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body.id).toBe(id);
        }
    });
});
