/// <reference types="cypress" />

describe('JSONPlaceholder API - Albums & Photos', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    it('Should get all albums', () => {
        cy.request(`${baseUrl}/albums`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(100);
        });
    });

    it('Should get a single album by ID', () => {
        cy.request(`${baseUrl}/albums/1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', 1);
            expect(response.body).to.have.property('userId');
            expect(response.body).to.have.property('title');
        });
    });

    it('Should get photos from an album', () => {
        cy.request(`${baseUrl}/albums/1/photos`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
        });
    });

    it('Should validate album structure', () => {
        cy.request(`${baseUrl}/albums/1`).then((response) => {
            expect(response.body).to.have.all.keys('userId', 'id', 'title');
        });
    });

    it('Should get all photos', () => {
        cy.request(`${baseUrl}/photos?_limit=100`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(100);
        });
    });

    it('Should validate photo structure', () => {
        cy.request(`${baseUrl}/photos/1`).then((response) => {
            expect(response.body).to.have.property('albumId');
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('title');
            expect(response.body).to.have.property('url');
            expect(response.body).to.have.property('thumbnailUrl');
        });
    });

    it('Should validate photo URLs', () => {
        cy.request(`${baseUrl}/photos/1`).then((response) => {
            expect(response.body.url).to.match(/^https?:\/\/.+/);
            expect(response.body.thumbnailUrl).to.match(/^https?:\/\/.+/);
        });
    });

    it('Should create a new album', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/albums`,
            body: {
                userId: 1,
                title: 'New Album'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.title).to.eq('New Album');
        });
    });

    it('Should update an album', () => {
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/albums/1`,
            body: {
                userId: 1,
                title: 'Updated Album'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should delete an album', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/albums/1`
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should filter albums by userId', () => {
        cy.request(`${baseUrl}/albums?userId=1`).then((response) => {
            expect(response.status).to.eq(200);
            response.body.forEach(album => {
                expect(album.userId).to.eq(1);
            });
        });
    });

    it('Should filter photos by albumId', () => {
        cy.request(`${baseUrl}/photos?albumId=1`).then((response) => {
            expect(response.status).to.eq(200);
            response.body.forEach(photo => {
                expect(photo.albumId).to.eq(1);
            });
        });
    });

    it('Should have 50 photos per album', () => {
        cy.request(`${baseUrl}/albums/1/photos`).then((response) => {
            expect(response.body).to.have.length(50);
        });
    });

    it('Should create a new photo', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/photos`,
            body: {
                albumId: 1,
                title: 'New Photo',
                url: 'https://via.placeholder.com/600/test',
                thumbnailUrl: 'https://via.placeholder.com/150/test'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });

    it('Should validate all albums have titles', () => {
        cy.request(`${baseUrl}/albums?_limit=50`).then((response) => {
            response.body.forEach(album => {
                expect(album.title).to.be.a('string');
                expect(album.title).to.not.be.empty;
            });
        });
    });

    it('Should validate photo titles exist', () => {
        cy.request(`${baseUrl}/photos?_limit=50`).then((response) => {
            response.body.forEach(photo => {
                expect(photo.title).to.be.a('string');
                expect(photo.title).to.not.be.empty;
            });
        });
    });

    it('Should return 404 for non-existent album', () => {
        cy.request({
            url: `${baseUrl}/albums/999`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('Should have albums for multiple users', () => {
        cy.request(`${baseUrl}/albums`).then((response) => {
            const userIds = [...new Set(response.body.map(a => a.userId))];
            expect(userIds.length).to.be.greaterThan(1);
        });
    });

    it('Should handle album pagination', () => {
        cy.request(`${baseUrl}/albums?_page=1&_limit=20`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(20);
        });
    });

    it('Should handle photo pagination', () => {
        cy.request(`${baseUrl}/photos?_page=1&_limit=100`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(100);
        });
    });
});
