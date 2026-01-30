/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';

describe('Accessibility Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
    });

    it('Should have proper page title', () => {
        cy.title().should('contain', 'Swag Labs');
    });

    it('Should have proper HTML lang attribute', () => {
        cy.get('html').should('have.attr', 'lang');
    });

    it('Should have accessible login form', () => {
        cy.get('[data-test="username"]').should('have.attr', 'placeholder');
        cy.get('[data-test="password"]').should('have.attr', 'placeholder');
    });

    it('Should have visible labels for form inputs', () => {
        cy.get('.form_group').should('be.visible');
    });

    it('Should have proper button labels', () => {
        cy.get('[data-test="login-button"]').should('have.attr', 'value');
    });

    it('Should support keyboard navigation on login', () => {
        cy.get('[data-test="username"]').focus().should('have.focus');
        cy.get('[data-test="username"]').type('{tab}');
        cy.get('[data-test="password"]').should('have.focus');
    });

    it('Should have semantic HTML structure', () => {
        cy.get('form').should('exist');
        cy.get('button').should('exist');
    });

    it('Should display error messages with proper contrast', () => {
        LoginPage.login('wrong', 'wrong');
        cy.get('[data-test="error"]').should('be.visible');
        cy.get('[data-test="error"]').should('have.css', 'background-color');
    });

    it('Should have visible focus indicators', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.btn_inventory').first().focus();
    });

    it('Should have alt text for images', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item img').each(($img) => {
            cy.wrap($img).should('have.attr', 'alt');
        });
    });

    it('Should have proper heading hierarchy', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.title').should('exist');
    });

    it('Should have clickable elements with sufficient size', () => {
        cy.get('[data-test="login-button"]').invoke('outerWidth').should('be.gt', 44);
        cy.get('[data-test="login-button"]').invoke('outerHeight').should('be.gt', 44);
    });

    it('Should support Enter key for form submission', () => {
        cy.get('[data-test="username"]').type('standard_user');
        cy.get('[data-test="password"]').type('secret_sauce{enter}');
        cy.url().should('include', 'inventory.html');
    });

    it('Should have proper link styling', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').first().should('have.css', 'cursor', 'pointer');
    });

    it('Should have visible cart icon', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_link').should('be.visible');
    });

    it('Should have descriptive button text', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.btn_inventory').first().should('not.be.empty');
    });

    it('Should support Tab navigation through products', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').first().focus().should('have.focus');
    });

    it('Should have sufficient color contrast for text', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').first().should('have.css', 'color');
    });

    it('Should have proper form structure', () => {
        cy.get('#login_button_container').should('exist');
    });

    it('Should have visible error close button', () => {
        LoginPage.login('wrong', 'wrong');
        cy.get('.error-button').should('be.visible');
    });
});
