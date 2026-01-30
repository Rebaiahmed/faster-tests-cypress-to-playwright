/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';
import CartPage from '../pageObjects/cartPage.js';

describe('Error Handling and Edge Cases', () => {
    beforeEach(() => {
        LoginPage.visit();
    });

    it('Should handle network errors gracefully', () => {
        cy.intercept('GET', '**/*.js', { statusCode: 500 }).as('serverError');
        cy.visit('https://www.saucedemo.com/inventory.html', { failOnStatusCode: false });
    });

    it('Should display error for SQL injection attempt', () => {
        LoginPage.login("' OR '1'='1", 'password');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle XSS attempt in username', () => {
        LoginPage.login('<script>alert("xss")</script>', 'password');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle special characters in username', () => {
        LoginPage.login('user@#$%', 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle very long username', () => {
        LoginPage.login('a'.repeat(1000), 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle very long password', () => {
        LoginPage.login('standard_user', 'a'.repeat(1000));
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle unicode characters', () => {
        LoginPage.login('用户名', 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle emoji in username', () => {
        LoginPage.login('user😀', 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle spaces in username', () => {
        LoginPage.login('   ', 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle case sensitivity', () => {
        LoginPage.login('STANDARD_USER', 'secret_sauce');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should prevent multiple rapid login attempts', () => {
        for(let i = 0; i < 5; i++) {
            LoginPage.login('standard_user', 'wrong');
            cy.get('.error-button').click();
        }
        cy.get('[data-test="error"]').should('exist');
    });

    it('Should handle refresh during checkout', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        cy.reload();
        cy.url().should('include', 'checkout-step-one.html');
    });

    it('Should handle back button during checkout', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        cy.go('back');
        cy.url().should('include', 'cart.html');
    });

    it('Should handle direct URL access to checkout without items', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.visit('https://www.saucedemo.com/checkout-step-one.html');
        cy.url().should('include', 'checkout-step-one.html');
    });

    it('Should handle missing product images', () => {
        LoginPage.login('problem_user', 'secret_sauce');
        cy.get('.inventory_item_img').should('exist');
    });

    it('Should validate checkout form fields', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        cy.get('[data-test="continue"]').click();
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should handle special characters in checkout form', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        cy.get('[data-test="firstName"]').type('<script>');
        cy.get('[data-test="lastName"]').type('alert(1)');
        cy.get('[data-test="postalCode"]').type('12345');
        cy.get('[data-test="continue"]').click();
        cy.url().should('include', 'checkout-step-two.html');
    });

    it('Should handle empty cart checkout attempt', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.visit('https://www.saucedemo.com/checkout-step-one.html');
        cy.get('[data-test="firstName"]').type('John');
        cy.get('[data-test="lastName"]').type('Doe');
        cy.get('[data-test="postalCode"]').type('12345');
        cy.get('[data-test="continue"]').click();
    });

    it('Should handle concurrent user sessions', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.clearCookies();
        cy.visit('https://www.saucedemo.com');
    });

    it('Should handle session timeout', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.wait(100);
        cy.reload();
        cy.url().should('include', 'inventory.html');
    });
});
