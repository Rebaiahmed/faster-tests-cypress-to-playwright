class AuthPage {
    visitLogin() {
        cy.visit('https://demo.realworld.io/#/login');
    }

    visitRegister() {
        cy.visit('https://demo.realworld.io/#/register');
    }

    getEmailInput() {
        return cy.get('input[type="email"]');
    }

    getPasswordInput() {
        return cy.get('input[type="password"]');
    }

    getUsernameInput() {
        return cy.get('input[placeholder="Username"]');
    }

    getSubmitButton() {
        return cy.get('button[type="submit"]');
    }

    login(email, password) {
        this.visitLogin();
        this.getEmailInput().type(email);
        this.getPasswordInput().type(password);
        this.getSubmitButton().click();
    }

    register(username, email, password) {
        this.visitRegister();
        this.getUsernameInput().type(username);
        this.getEmailInput().type(email);
        this.getPasswordInput().type(password);
        this.getSubmitButton().click();
    }

    getErrorMessages() {
        return cy.get('.error-messages li');
    }

    verifyLoggedIn() {
        cy.url().should('include', '#/');
        cy.get('.nav-link').contains('New Article').should('be.visible');
    }
}

export default new AuthPage();
