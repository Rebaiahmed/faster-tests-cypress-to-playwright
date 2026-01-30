const { test, expect } = require('@playwright/test');

test.describe('JSONPlaceholder API - Posts Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Should get all posts', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(100);
        expect(response.headers()['content-type']).toContain('application/json');
    });

    test('Should get a single post by ID', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts/1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('id', 1);
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('body');
    });

    test('Should return 404 for non-existent post', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts/999`, {
            failOnStatusCode: false
        });
        expect(response.status()).toBe(404);
    });

    test('Should create a new post', async ({ request }) => {
        const response = await request.post(`${baseUrl}/posts`, {
            data: {
                title: 'Test Post',
                body: 'This is a test post body',
                userId: 1
            }
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body).toHaveProperty('id');
        expect(body.title).toBe('Test Post');
    });

    test('Should update a post using PUT', async ({ request }) => {
        const response = await request.put(`${baseUrl}/posts/1`, {
            data: {
                id: 1,
                title: 'Updated Title',
                body: 'Updated body',
                userId: 1
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.title).toBe('Updated Title');
    });

    test('Should partially update a post using PATCH', async ({ request }) => {
        const response = await request.patch(`${baseUrl}/posts/1`, {
            data: {
                title: 'Patched Title'
            }
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.title).toBe('Patched Title');
    });

    test('Should delete a post', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/posts/1`);
        expect(response.status()).toBe(200);
    });

    test('Should filter posts by userId', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts?userId=1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        body.forEach(post => {
            expect(post.userId).toBe(1);
        });
    });

    test('Should get comments for a post', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts/1/comments`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
    });

    test('Should validate post structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts/1`);
        const body = await response.json();
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('body');
        expect(typeof body.id).toBe('number');
        expect(typeof body.userId).toBe('number');
        expect(typeof body.title).toBe('string');
        expect(typeof body.body).toBe('string');
    });

    test('Should have correct response time', async ({ request }) => {
        const startTime = Date.now();
        await request.get(`${baseUrl}/posts`);
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(5000);
    });

    test('Should handle multiple posts by ID', async ({ request }) => {
        const postIds = [1, 2, 3];
        for (const id of postIds) {
            const response = await request.get(`${baseUrl}/posts/${id}`);
            expect(response.status()).toBe(200);
            const body = await response.json();
            expect(body.id).toBe(id);
        }
    });

    test('Should return correct content type', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts`);
        const headers = response.headers();
        expect(headers).toHaveProperty('content-type');
        expect(headers['content-type']).toContain('application/json');
    });

    test('Should validate all posts have required fields', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts`);
        const body = await response.json();
        body.forEach(post => {
            expect(post).toHaveProperty('id');
            expect(post).toHaveProperty('userId');
            expect(post).toHaveProperty('title');
            expect(post).toHaveProperty('body');
        });
    });

    test('Should handle creating post without userId', async ({ request }) => {
        const response = await request.post(`${baseUrl}/posts`, {
            data: {
                title: 'Test Post',
                body: 'This is a test'
            }
        });
        expect(response.status()).toBe(201);
    });

    test('Should verify posts are numbered sequentially', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts`);
        const body = await response.json();
        const ids = body.map(post => post.id);
        expect(ids[0]).toBe(1);
        expect(ids[99]).toBe(100);
    });

    test('Should get last post', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts/100`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(100);
    });

    test('Should handle empty body in POST', async ({ request }) => {
        const response = await request.post(`${baseUrl}/posts`, {
            data: {}
        });
        expect(response.status()).toBe(201);
    });

    test('Should return proper CORS headers', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts`);
        const headers = response.headers();
        expect(headers).toHaveProperty('access-control-allow-credentials');
    });

    test('Should support query parameters', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts?_limit=5`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(5);
    });
});
