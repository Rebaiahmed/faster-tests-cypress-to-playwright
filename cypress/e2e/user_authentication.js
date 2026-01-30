/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';

describe('User Authentication Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
    });

    it('Should display login form', () => {
        cy.get('[data-test="username"]').should('be.visible');
        cy.get('[data-test="password"]').should('be.visible');
        cy.get('[data-test="login-button"]').should('be.visible');
    });

    it('Should display Swag Labs logo', () => {
        cy.get('.login_logo').should('be.visible');
    });

    it('Should have empty username field initially', () => {
        cy.get('[data-test="username"]').should('have.value', '');
    });

    it('Should have empty password field initially', () => {
        cy.get('[data-test="password"]').should('have.value', '');
    });

    it('Should accept username input', () => {
        cy.get('[data-test="username"]').type('test_user');
        cy.get('[data-test="username"]').should('have.value', 'test_user');
    });

    it('Should accept password input', () => {
        cy.get('[data-test="password"]').type('test_password');
        cy.get('[data-test="password"]').should('have.value', 'test_password');
    });

    it('Should mask password input', () => {
        cy.get('[data-test="password"]').should('have.attr', 'type', 'password');
    });

    it('Should login with standard user', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html');
    });

    it('Should show error with wrong password', () => {
        LoginPage.login('standard_user', 'wrong_password');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should show error with wrong username', () => {
        LoginPage.login('wrong_user', 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should show error with empty username', () => {
        LoginPage.login('', 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should show error with empty password', () => {
        LoginPage.login('standard_user', '');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should show error with both fields empty', () => {
        cy.get('[data-test="login-button"]').click();
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should display error message for locked user', () => {
        LoginPage.login('locked_out_user', 'secret_sauce');
        cy.get('[data-test="error"]').should('contain', 'locked out');
    });

    it('Should close error message', () => {
        LoginPage.login('wrong_user', 'wrong_pass');
        cy.get('.error-button').click();
        cy.get('[data-test="error"]').should('not.exist');
    });

    it('Should login with problem user', () => {
        LoginPage.login('problem_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html');
    });

    it('Should login with performance glitch user', () => {
        LoginPage.login('performance_glitch_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html');
    });

    it('Should clear fields after error', () => {
        LoginPage.login('wrong', 'wrong');
        cy.get('.error-button').click();
        cy.get('[data-test="username"]').clear().should('have.value', '');
    });

    it('Should maintain login state after refresh', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.reload();
        cy.url().should('include', 'inventory.html');
    });

    it('Should logout successfully', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
        cy.url().should('not.include', 'inventory');
    });

    it('Should not access inventory without login', () => {
        cy.visit('https://www.saucedemo.com/inventory.html');
        cy.url().should('not.include', 'inventory');
    });

    it('Should display accept all usernames text', () => {
        cy.get('.login_credentials').should('be.visible');
    });

    it('Should display password text', () => {
        cy.get('.login_password').should('be.visible');
    });
});
