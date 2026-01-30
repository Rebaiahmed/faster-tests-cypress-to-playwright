/// <reference types="cypress" />

describe('JSONPlaceholder API - Comments Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    it('Should get all comments', () => {
        cy.request(`${baseUrl}/comments`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(500);
        });
    });

    it('Should get a single comment by ID', () => {
        cy.request(`${baseUrl}/comments/1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', 1);
        });
    });

    it('Should validate comment structure', () => {
        cy.request(`${baseUrl}/comments/1`).then((response) => {
            expect(response.body).to.have.all.keys('postId', 'id', 'name', 'email', 'body');
        });
    });

    it('Should validate email format in comments', () => {
        cy.request(`${baseUrl}/comments/1`).then((response) => {
            expect(response.body.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });

    it('Should get comments for a specific post', () => {
        cy.request(`${baseUrl}/comments?postId=1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(comment => {
                expect(comment.postId).to.eq(1);
            });
        });
    });

    it('Should create a new comment', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/comments`,
            body: {
                postId: 1,
                name: 'Test Comment',
                email: 'test@example.com',
                body: 'This is a test comment'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.name).to.eq('Test Comment');
        });
    });

    it('Should update a comment', () => {
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/comments/1`,
            body: {
                postId: 1,
                name: 'Updated Comment',
                email: 'updated@example.com',
                body: 'Updated body'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should delete a comment', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/comments/1`
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should validate all comments have email', () => {
        cy.request(`${baseUrl}/comments?_limit=50`).then((response) => {
            response.body.forEach(comment => {
                expect(comment.email).to.be.a('string');
                expect(comment.email).to.not.be.empty;
            });
        });
    });

    it('Should validate all comments have body', () => {
        cy.request(`${baseUrl}/comments?_limit=50`).then((response) => {
            response.body.forEach(comment => {
                expect(comment.body).to.be.a('string');
                expect(comment.body).to.not.be.empty;
            });
        });
    });

    it('Should get comments with limit', () => {
        cy.request(`${baseUrl}/comments?_limit=10`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(10);
        });
    });

    it('Should have multiple comments per post', () => {
        cy.request(`${baseUrl}/comments?postId=1`).then((response) => {
            expect(response.body.length).to.be.greaterThan(1);
        });
    });

    it('Should validate postId is numeric', () => {
        cy.request(`${baseUrl}/comments/1`).then((response) => {
            expect(response.body.postId).to.be.a('number');
        });
    });

    it('Should filter comments by email', () => {
        cy.request(`${baseUrl}/comments?email=Eliseo@gardner.biz`).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should return 404 for non-existent comment', () => {
        cy.request({
            url: `${baseUrl}/comments/9999`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('Should have comments for different posts', () => {
        cy.request(`${baseUrl}/comments?_limit=100`).then((response) => {
            const postIds = [...new Set(response.body.map(c => c.postId))];
            expect(postIds.length).to.be.greaterThan(1);
        });
    });

    it('Should validate comment name exists', () => {
        cy.request(`${baseUrl}/comments/1`).then((response) => {
            expect(response.body.name).to.be.a('string');
            expect(response.body.name).to.not.be.empty;
        });
    });

    it('Should handle pagination for comments', () => {
        cy.request(`${baseUrl}/comments?_page=1&_limit=50`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(50);
        });
    });

    it('Should validate comment IDs are unique', () => {
        cy.request(`${baseUrl}/comments?_limit=100`).then((response) => {
            const ids = response.body.map(c => c.id);
            const uniqueIds = [...new Set(ids)];
            expect(ids.length).to.eq(uniqueIds.length);
        });
    });

    it('Should partial update comment with PATCH', () => {
        cy.request({
            method: 'PATCH',
            url: `${baseUrl}/comments/1`,
            body: {
                body: 'Patched comment body'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});
