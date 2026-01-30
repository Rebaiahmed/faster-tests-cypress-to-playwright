/// <reference types="cypress" />

describe('JSONPlaceholder API - Users Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    it('Should get all users', () => {
        cy.request(`${baseUrl}/users`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(10);
        });
    });

    it('Should get a single user by ID', () => {
        cy.request(`${baseUrl}/users/1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', 1);
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('email');
        });
    });

    it('Should validate user structure', () => {
        cy.request(`${baseUrl}/users/1`).then((response) => {
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('username');
            expect(response.body).to.have.property('email');
            expect(response.body).to.have.property('address');
            expect(response.body).to.have.property('phone');
            expect(response.body).to.have.property('website');
            expect(response.body).to.have.property('company');
        });
    });

    it('Should validate user address structure', () => {
        cy.request(`${baseUrl}/users/1`).then((response) => {
            expect(response.body.address).to.have.property('street');
            expect(response.body.address).to.have.property('suite');
            expect(response.body.address).to.have.property('city');
            expect(response.body.address).to.have.property('zipcode');
            expect(response.body.address).to.have.property('geo');
        });
    });

    it('Should validate geo coordinates', () => {
        cy.request(`${baseUrl}/users/1`).then((response) => {
            expect(response.body.address.geo).to.have.property('lat');
            expect(response.body.address.geo).to.have.property('lng');
        });
    });

    it('Should validate company structure', () => {
        cy.request(`${baseUrl}/users/1`).then((response) => {
            expect(response.body.company).to.have.property('name');
            expect(response.body.company).to.have.property('catchPhrase');
            expect(response.body.company).to.have.property('bs');
        });
    });

    it('Should get user posts', () => {
        cy.request(`${baseUrl}/users/1/posts`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
        });
    });

    it('Should get user albums', () => {
        cy.request(`${baseUrl}/users/1/albums`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('Should get user todos', () => {
        cy.request(`${baseUrl}/users/1/todos`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('Should validate email format', () => {
        cy.request(`${baseUrl}/users`).then((response) => {
            response.body.forEach(user => {
                expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            });
        });
    });

    it('Should create a new user', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/users`,
            body: {
                name: 'Test User',
                username: 'testuser',
                email: 'test@example.com'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.name).to.eq('Test User');
        });
    });

    it('Should update a user', () => {
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/users/1`,
            body: {
                name: 'Updated Name',
                email: 'updated@example.com'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should delete a user', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/users/1`
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should have unique user IDs', () => {
        cy.request(`${baseUrl}/users`).then((response) => {
            const ids = response.body.map(user => user.id);
            const uniqueIds = [...new Set(ids)];
            expect(ids.length).to.eq(uniqueIds.length);
        });
    });

    it('Should have unique usernames', () => {
        cy.request(`${baseUrl}/users`).then((response) => {
            const usernames = response.body.map(user => user.username);
            const uniqueUsernames = [...new Set(usernames)];
            expect(usernames.length).to.eq(uniqueUsernames.length);
        });
    });

    it('Should validate all users have websites', () => {
        cy.request(`${baseUrl}/users`).then((response) => {
            response.body.forEach(user => {
                expect(user.website).to.be.a('string');
                expect(user.website).to.not.be.empty;
            });
        });
    });

    it('Should filter users by name', () => {
        cy.request(`${baseUrl}/users?name=Leanne Graham`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('Should validate phone numbers exist', () => {
        cy.request(`${baseUrl}/users`).then((response) => {
            response.body.forEach(user => {
                expect(user.phone).to.be.a('string');
                expect(user.phone).to.not.be.empty;
            });
        });
    });

    it('Should return user with valid JSON', () => {
        cy.request(`${baseUrl}/users/1`).then((response) => {
            expect(response.body).to.be.an('object');
        });
    });

    it('Should handle multiple user requests', () => {
        [1, 2, 3, 4, 5].forEach(id => {
            cy.request(`${baseUrl}/users/${id}`).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(id);
            });
        });
    });
});
