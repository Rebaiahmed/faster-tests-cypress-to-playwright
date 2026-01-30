/// <reference types="cypress" />

describe('JSONPlaceholder API - Posts Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    it('Should get all posts', () => {
        cy.request(`${baseUrl}/posts`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(100);
            expect(response.headers['content-type']).to.include('application/json');
        });
    });

    it('Should get a single post by ID', () => {
        cy.request(`${baseUrl}/posts/1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', 1);
            expect(response.body).to.have.property('userId');
            expect(response.body).to.have.property('title');
            expect(response.body).to.have.property('body');
        });
    });

    it('Should return 404 for non-existent post', () => {
        cy.request({
            url: `${baseUrl}/posts/999`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('Should create a new post', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/posts`,
            body: {
                title: 'Test Post',
                body: 'This is a test post body',
                userId: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.title).to.eq('Test Post');
        });
    });

    it('Should update a post using PUT', () => {
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/posts/1`,
            body: {
                id: 1,
                title: 'Updated Title',
                body: 'Updated body',
                userId: 1
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.title).to.eq('Updated Title');
        });
    });

    it('Should partially update a post using PATCH', () => {
        cy.request({
            method: 'PATCH',
            url: `${baseUrl}/posts/1`,
            body: {
                title: 'Patched Title'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.title).to.eq('Patched Title');
        });
    });

    it('Should delete a post', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/posts/1`
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should filter posts by userId', () => {
        cy.request(`${baseUrl}/posts?userId=1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            response.body.forEach(post => {
                expect(post.userId).to.eq(1);
            });
        });
    });

    it('Should get comments for a post', () => {
        cy.request(`${baseUrl}/posts/1/comments`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
        });
    });

    it('Should validate post structure', () => {
        cy.request(`${baseUrl}/posts/1`).then((response) => {
            expect(response.body).to.have.all.keys('userId', 'id', 'title', 'body');
            expect(response.body.id).to.be.a('number');
            expect(response.body.userId).to.be.a('number');
            expect(response.body.title).to.be.a('string');
            expect(response.body.body).to.be.a('string');
        });
    });

    it('Should have correct response time', () => {
        cy.request(`${baseUrl}/posts`).then((response) => {
            expect(response.duration).to.be.lessThan(5000);
        });
    });

    it('Should handle multiple posts by ID', () => {
        const postIds = [1, 2, 3];
        postIds.forEach(id => {
            cy.request(`${baseUrl}/posts/${id}`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(id);
            });
        });
    });

    it('Should return correct content type', () => {
        cy.request(`${baseUrl}/posts`).then((response) => {
            expect(response.headers).to.have.property('content-type');
            expect(response.headers['content-type']).to.include('application/json');
        });
    });

    it('Should validate all posts have required fields', () => {
        cy.request(`${baseUrl}/posts`).then((response) => {
            response.body.forEach(post => {
                expect(post).to.have.property('id');
                expect(post).to.have.property('userId');
                expect(post).to.have.property('title');
                expect(post).to.have.property('body');
            });
        });
    });

    it('Should handle creating post without userId', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/posts`,
            body: {
                title: 'Test Post',
                body: 'This is a test'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });

    it('Should verify posts are numbered sequentially', () => {
        cy.request(`${baseUrl}/posts`).then((response) => {
            const ids = response.body.map(post => post.id);
            expect(ids[0]).to.eq(1);
            expect(ids[99]).to.eq(100);
        });
    });

    it('Should get last post', () => {
        cy.request(`${baseUrl}/posts/100`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(100);
        });
    });

    it('Should handle empty body in POST', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/posts`,
            body: {}
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });

    it('Should return proper CORS headers', () => {
        cy.request(`${baseUrl}/posts`).then((response) => {
            expect(response.headers).to.have.property('access-control-allow-credentials');
        });
    });

    it('Should support query parameters', () => {
        cy.request(`${baseUrl}/posts?_limit=5`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(5);
        });
    });
});
