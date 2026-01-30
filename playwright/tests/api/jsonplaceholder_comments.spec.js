const { test, expect } = require('@playwright/test');

test.describe('JSONPlaceholder API - Comments Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Should get all comments', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(500);
    });

    test('Should get a single comment by ID', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments/1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('id', 1);
    });

    test('Should validate comment structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments/1`);
        const body = await response.json();
        expect(body).toHaveProperty('postId');
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('name');
        expect(body).toHaveProperty('email');
        expect(body).toHaveProperty('body');
    });

    test('Should validate email format in comments', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments/1`);
        const body = await response.json();
        expect(body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    test('Should get comments for a specific post', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?postId=1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        body.forEach(comment => {
            expect(comment.postId).toBe(1);
        });
    });

    test('Should create a new comment', async ({ request }) => {
        const response = await request.post(`${baseUrl}/comments`, {
            data: {
                postId: 1,
                name: 'Test Comment',
                email: 'test@example.com',
                body: 'This is a test comment'
            }
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.name).toBe('Test Comment');
    });

    test('Should update a comment', async ({ request }) => {
        const response = await request.put(`${baseUrl}/comments/1`, {
            data: {
                postId: 1,
                name: 'Updated Comment',
                email: 'updated@example.com',
                body: 'Updated body'
            }
        });
        expect(response.status()).toBe(200);
    });

    test('Should delete a comment', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/comments/1`);
        expect(response.status()).toBe(200);
    });

    test('Should validate all comments have email', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?_limit=50`);
        const body = await response.json();
        body.forEach(comment => {
            expect(typeof comment.email).toBe('string');
            expect(comment.email).not.toBe('');
        });
    });

    test('Should validate all comments have body', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?_limit=50`);
        const body = await response.json();
        body.forEach(comment => {
            expect(typeof comment.body).toBe('string');
            expect(comment.body).not.toBe('');
        });
    });

    test('Should get comments with limit', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?_limit=10`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(10);
    });

    test('Should have multiple comments per post', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?postId=1`);
        const body = await response.json();
        expect(body.length).toBeGreaterThan(1);
    });

    test('Should validate postId is numeric', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments/1`);
        const body = await response.json();
        expect(typeof body.postId).toBe('number');
    });

    test('Should filter comments by email', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?email=Eliseo@gardner.biz`);
        expect(response.status()).toBe(200);
    });

    test('Should return 404 for non-existent comment', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments/9999`, {
            failOnStatusCode: false
        });
        expect(response.status()).toBe(404);
    });

    test('Should have comments for different posts', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?_limit=100`);
        const body = await response.json();
        const postIds = [...new Set(body.map(c => c.postId))];
        expect(postIds.length).toBeGreaterThan(1);
    });

    test('Should validate comment name exists', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments/1`);
        const body = await response.json();
        expect(typeof body.name).toBe('string');
        expect(body.name).not.toBe('');
    });

    test('Should handle pagination for comments', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?_page=1&_limit=50`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(50);
    });

    test('Should validate comment IDs are unique', async ({ request }) => {
        const response = await request.get(`${baseUrl}/comments?_limit=100`);
        const body = await response.json();
        const ids = body.map(c => c.id);
        const uniqueIds = [...new Set(ids)];
        expect(ids.length).toBe(uniqueIds.length);
    });

    test('Should partial update comment with PATCH', async ({ request }) => {
        const response = await request.patch(`${baseUrl}/comments/1`, {
            data: {
                body: 'Patched comment body'
            }
        });
        expect(response.status()).toBe(200);
    });
});
