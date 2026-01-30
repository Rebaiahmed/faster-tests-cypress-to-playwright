const { test, expect } = require('@playwright/test');

test.describe('JSONPlaceholder API - Albums & Photos', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Should get all albums', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(100);
    });

    test('Should get a single album by ID', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums/1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('id', 1);
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('title');
    });

    test('Should get photos from an album', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums/1/photos`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
    });

    test('Should validate album structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums/1`);
        const body = await response.json();
        expect(body).toHaveProperty('userId');
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('title');
    });

    test('Should get all photos', async ({ request }) => {
        const response = await request.get(`${baseUrl}/photos?_limit=100`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(100);
    });

    test('Should validate photo structure', async ({ request }) => {
        const response = await request.get(`${baseUrl}/photos/1`);
        const body = await response.json();
        expect(body).toHaveProperty('albumId');
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('url');
        expect(body).toHaveProperty('thumbnailUrl');
    });

    test('Should validate photo URLs', async ({ request }) => {
        const response = await request.get(`${baseUrl}/photos/1`);
        const body = await response.json();
        expect(body.url).toMatch(/^https?:\/\/.+/);
        expect(body.thumbnailUrl).toMatch(/^https?:\/\/.+/);
    });

    test('Should create a new album', async ({ request }) => {
        const response = await request.post(`${baseUrl}/albums`, {
            data: {
                userId: 1,
                title: 'New Album'
            }
        });
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.title).toBe('New Album');
    });

    test('Should update an album', async ({ request }) => {
        const response = await request.put(`${baseUrl}/albums/1`, {
            data: {
                userId: 1,
                title: 'Updated Album'
            }
        });
        expect(response.status()).toBe(200);
    });

    test('Should delete an album', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/albums/1`);
        expect(response.status()).toBe(200);
    });

    test('Should filter albums by userId', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums?userId=1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        body.forEach(album => {
            expect(album.userId).toBe(1);
        });
    });

    test('Should filter photos by albumId', async ({ request }) => {
        const response = await request.get(`${baseUrl}/photos?albumId=1`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        body.forEach(photo => {
            expect(photo.albumId).toBe(1);
        });
    });

    test('Should have 50 photos per album', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums/1/photos`);
        const body = await response.json();
        expect(body).toHaveLength(50);
    });

    test('Should create a new photo', async ({ request }) => {
        const response = await request.post(`${baseUrl}/photos`, {
            data: {
                albumId: 1,
                title: 'New Photo',
                url: 'https://via.placeholder.com/600/test',
                thumbnailUrl: 'https://via.placeholder.com/150/test'
            }
        });
        expect(response.status()).toBe(201);
    });

    test('Should validate all albums have titles', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums?_limit=50`);
        const body = await response.json();
        body.forEach(album => {
            expect(typeof album.title).toBe('string');
            expect(album.title).not.toBe('');
        });
    });

    test('Should validate photo titles exist', async ({ request }) => {
        const response = await request.get(`${baseUrl}/photos?_limit=50`);
        const body = await response.json();
        body.forEach(photo => {
            expect(typeof photo.title).toBe('string');
            expect(photo.title).not.toBe('');
        });
    });

    test('Should return 404 for non-existent album', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums/999`, {
            failOnStatusCode: false
        });
        expect(response.status()).toBe(404);
    });

    test('Should have albums for multiple users', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums`);
        const body = await response.json();
        const userIds = [...new Set(body.map(a => a.userId))];
        expect(userIds.length).toBeGreaterThan(1);
    });

    test('Should handle album pagination', async ({ request }) => {
        const response = await request.get(`${baseUrl}/albums?_page=1&_limit=20`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(20);
    });

    test('Should handle photo pagination', async ({ request }) => {
        const response = await request.get(`${baseUrl}/photos?_page=1&_limit=100`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveLength(100);
    });
});
