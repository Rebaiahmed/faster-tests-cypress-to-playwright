/// <reference types="cypress" />
import AuthPage from '../../pageObjects/realworld/authPage.js';
import HomePage from '../../pageObjects/realworld/homePage.js';

describe('RealWorld - Authentication Tests', () => {
    beforeEach(() => {
        HomePage.visit();
    });

    it('Should display login page correctly', () => {
        AuthPage.visitLogin();
        cy.url().should('include', '#/login');
        cy.contains('h1', 'Sign in').should('be.visible');
    });

    it('Should display register page correctly', () => {
        AuthPage.visitRegister();
        cy.url().should('include', '#/register');
        cy.contains('h1', 'Sign up').should('be.visible');
    });

    it('Should have link to switch from login to register', () => {
        AuthPage.visitLogin();
        cy.contains('a', 'Need an account?').should('be.visible');
    });

    it('Should have link to switch from register to login', () => {
        AuthPage.visitRegister();
        cy.contains('a', 'Have an account?').should('be.visible');
    });

    it('Should show error for empty login form', () => {
        AuthPage.visitLogin();
        AuthPage.getSubmitButton().click();
        cy.url().should('include', '#/login');
    });

    it('Should show error for empty register form', () => {
        AuthPage.visitRegister();
        AuthPage.getSubmitButton().click();
        cy.url().should('include', '#/register');
    });

    it('Should show error for invalid email format in login', () => {
        AuthPage.visitLogin();
        AuthPage.getEmailInput().type('invalid-email');
        AuthPage.getPasswordInput().type('password123');
        AuthPage.getSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '#/login');
    });

    it('Should accept valid email format', () => {
        AuthPage.visitLogin();
        AuthPage.getEmailInput().type('test@example.com').should('have.value', 'test@example.com');
    });

    it('Should mask password input', () => {
        AuthPage.visitLogin();
        AuthPage.getPasswordInput().should('have.attr', 'type', 'password');
    });

    it('Should enable submit button when form is filled', () => {
        AuthPage.visitLogin();
        AuthPage.getEmailInput().type('test@example.com');
        AuthPage.getPasswordInput().type('password123');
        AuthPage.getSubmitButton().should('not.be.disabled');
    });

    it('Should display username field on register page', () => {
        AuthPage.visitRegister();
        AuthPage.getUsernameInput().should('be.visible');
    });

    it('Should navigate to register from login', () => {
        AuthPage.visitLogin();
        cy.contains('a', 'Need an account?').click();
        cy.url().should('include', '#/register');
    });

    it('Should navigate to login from register', () => {
        AuthPage.visitRegister();
        cy.contains('a', 'Have an account?').click();
        cy.url().should('include', '#/login');
    });

    it('Should persist input values when switching between forms', () => {
        AuthPage.visitLogin();
        AuthPage.getEmailInput().type('test@example.com');
        cy.contains('a', 'Need an account?').click();
        cy.go('back');
        AuthPage.getEmailInput().should('have.value', '');
    });

    it('Should show email input placeholder', () => {
        AuthPage.visitLogin();
        AuthPage.getEmailInput().should('have.attr', 'placeholder', 'Email');
    });

    it('Should show password input placeholder', () => {
        AuthPage.visitLogin();
        AuthPage.getPasswordInput().should('have.attr', 'placeholder', 'Password');
    });

    it('Should display sign in button text', () => {
        AuthPage.visitLogin();
        AuthPage.getSubmitButton().should('contain', 'Sign in');
    });

    it('Should display sign up button text', () => {
        AuthPage.visitRegister();
        AuthPage.getSubmitButton().should('contain', 'Sign up');
    });

    it('Should have conduit branding on auth pages', () => {
        AuthPage.visitLogin();
        cy.get('.navbar-brand').should('contain', 'conduit');
    });

    it('Should display home link in navigation', () => {
        AuthPage.visitLogin();
        cy.get('.navbar').contains('Home').should('be.visible');
    });
});
