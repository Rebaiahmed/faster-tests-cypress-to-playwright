/// <reference types="cypress" />

describe('JSONPlaceholder API - Todos Endpoints', () => {
    const baseUrl = 'https://jsonplaceholder.typicode.com';

    it('Should get all todos', () => {
        cy.request(`${baseUrl}/todos`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(200);
        });
    });

    it('Should get a single todo by ID', () => {
        cy.request(`${baseUrl}/todos/1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', 1);
            expect(response.body).to.have.property('userId');
            expect(response.body).to.have.property('title');
            expect(response.body).to.have.property('completed');
        });
    });

    it('Should validate todo structure', () => {
        cy.request(`${baseUrl}/todos/1`).then((response) => {
            expect(response.body).to.have.all.keys('userId', 'id', 'title', 'completed');
        });
    });

    it('Should validate completed field is boolean', () => {
        cy.request(`${baseUrl}/todos/1`).then((response) => {
            expect(response.body.completed).to.be.a('boolean');
        });
    });

    it('Should create a new todo', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/todos`,
            body: {
                userId: 1,
                title: 'New Todo',
                completed: false
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.title).to.eq('New Todo');
        });
    });

    it('Should update a todo', () => {
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/todos/1`,
            body: {
                userId: 1,
                id: 1,
                title: 'Updated Todo',
                completed: true
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.completed).to.eq(true);
        });
    });

    it('Should mark todo as complete using PATCH', () => {
        cy.request({
            method: 'PATCH',
            url: `${baseUrl}/todos/1`,
            body: {
                completed: true
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.completed).to.eq(true);
        });
    });

    it('Should delete a todo', () => {
        cy.request({
            method: 'DELETE',
            url: `${baseUrl}/todos/1`
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    it('Should filter todos by userId', () => {
        cy.request(`${baseUrl}/todos?userId=1`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(todo => {
                expect(todo.userId).to.eq(1);
            });
        });
    });

    it('Should filter completed todos', () => {
        cy.request(`${baseUrl}/todos?completed=true`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(todo => {
                expect(todo.completed).to.eq(true);
            });
        });
    });

    it('Should filter incomplete todos', () => {
        cy.request(`${baseUrl}/todos?completed=false`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(todo => {
                expect(todo.completed).to.eq(false);
            });
        });
    });

    it('Should validate all todos have titles', () => {
        cy.request(`${baseUrl}/todos`).then((response) => {
            response.body.forEach(todo => {
                expect(todo.title).to.be.a('string');
                expect(todo.title).to.not.be.empty;
            });
        });
    });

    it('Should get todos with limit', () => {
        cy.request(`${baseUrl}/todos?_limit=10`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(10);
        });
    });

    it('Should validate userId is numeric', () => {
        cy.request(`${baseUrl}/todos/1`).then((response) => {
            expect(response.body.userId).to.be.a('number');
            expect(response.body.userId).to.be.greaterThan(0);
        });
    });

    it('Should have todos for multiple users', () => {
        cy.request(`${baseUrl}/todos`).then((response) => {
            const userIds = [...new Set(response.body.map(todo => todo.userId))];
            expect(userIds.length).to.be.greaterThan(1);
        });
    });

    it('Should return 404 for non-existent todo', () => {
        cy.request({
            url: `${baseUrl}/todos/999`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    it('Should have mix of completed and incomplete todos', () => {
        cy.request(`${baseUrl}/todos`).then((response) => {
            const completed = response.body.filter(todo => todo.completed);
            const incomplete = response.body.filter(todo => !todo.completed);
            expect(completed.length).to.be.greaterThan(0);
            expect(incomplete.length).to.be.greaterThan(0);
        });
    });

    it('Should validate todo IDs are sequential', () => {
        cy.request(`${baseUrl}/todos`).then((response) => {
            const ids = response.body.map(todo => todo.id);
            expect(ids[0]).to.eq(1);
            expect(ids[199]).to.eq(200);
        });
    });

    it('Should handle pagination', () => {
        cy.request(`${baseUrl}/todos?_page=1&_limit=20`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.length(20);
        });
    });

    it('Should create todo without completed field', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/todos`,
            body: {
                userId: 1,
                title: 'New Todo'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });
});
