const { test, expect } = require('@playwright/test');

test.describe('JSONPlaceholder API - Todos Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Should get all todos', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(200);
    });

    test('Should get a single todo by ID', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos/1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('id', 1);
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('completed');
    });

    test('Should validate todo structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos/1`);
        const body = await response.json();
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('completed');
    });

    test('Should validate completed field is boolean', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos/1`);
        const body = await response.json();
        expect(typeof body.completed).toBe('boolean');
    });

    test('Should create a new todo', async ({ request }) => {
        const response = await request.post(`${baseUrl}/todos`, {
            data: {
                userId: 1,
                title: 'New Todo',
                completed: false
            }
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.title).toBe('New Todo');
    });

    test('Should update a todo', async ({ request }) => {
        const response = await request.put(`${baseUrl}/todos/1`, {
            data: {
                userId: 1,
                id: 1,
                title: 'Updated Todo',
                completed: true
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.completed).toBe(true);
    });

    test('Should mark todo as complete using PATCH', async ({ request }) => {
        const response = await request.patch(`${baseUrl}/todos/1`, {
            data: {
                completed: true
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.completed).toBe(true);
    });

    test('Should delete a todo', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/todos/1`);
        expect(response.status()).toBe(200);
    });

    test('Should filter todos by userId', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos?userId=1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        body.forEach(todo => {
            expect(todo.userId).toBe(1);
        });
    });

    test('Should filter completed todos', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos?completed=true`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        body.forEach(todo => {
            expect(todo.completed).toBe(true);
        });
    });

    test('Should filter incomplete todos', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos?completed=false`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        body.forEach(todo => {
            expect(todo.completed).toBe(false);
        });
    });

    test('Should validate all todos have titles', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos`);
        const body = await response.json();
        body.forEach(todo => {
            expect(typeof todo.title).toBe('string');
            expect(todo.title).not.toBe('');
        });
    });

    test('Should get todos with limit', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos?_limit=10`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(10);
    });

    test('Should validate userId is numeric', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos/1`);
        const body = await response.json();
        expect(typeof body.userId).toBe('number');
        expect(body.userId).toBeGreaterThan(0);
    });

    test('Should have todos for multiple users', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos`);
        const body = await response.json();
        const userIds = [...new Set(body.map(todo => todo.userId))];
        expect(userIds.length).toBeGreaterThan(1);
    });

    test('Should return 404 for non-existent todo', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos/999`, {
            failOnStatusCode: false
        });
        expect(response.status()).toBe(404);
    });

    test('Should have mix of completed and incomplete todos', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos`);
        const body = await response.json();
        const completed = body.filter(todo => todo.completed);
        const incomplete = body.filter(todo => !todo.completed);
        expect(completed.length).toBeGreaterThan(0);
        expect(incomplete.length).toBeGreaterThan(0);
    });

    test('Should validate todo IDs are sequential', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos`);
        const body = await response.json();
        const ids = body.map(todo => todo.id);
        expect(ids[0]).toBe(1);
        expect(ids[199]).toBe(200);
    });

    test('Should handle pagination', async ({ request }) => {
        const response = await request.get(`${baseUrl}/todos?_page=1&_limit=20`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(20);
    });

    test('Should create todo without completed field', async ({ request }) => {
        const response = await request.post(`${baseUrl}/todos`, {
            data: {
                userId: 1,
                title: 'New Todo'
            }
        });
        expect(response.status()).toBe(201);
    });
});
