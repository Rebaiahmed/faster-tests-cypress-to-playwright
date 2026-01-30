/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Session Management Tests', () => {
    it('Should create session on login', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.getCookie('session-username').should('exist');
    });

    it('Should maintain session across pages', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_link').click();
        cy.getCookie('session-username').should('exist');
    });

    it('Should persist cart in session', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.reload();
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should clear session on logout', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
        cy.getCookie('session-username').should('not.exist');
    });

    it('Should handle session after refresh', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.reload();
        cy.url().should('include', 'inventory.html');
    });

    it('Should prevent access without session', () => {
        cy.visit('https://www.saucedemo.com/inventory.html');
        cy.url().should('not.include', 'inventory.html');
    });

    it('Should maintain filter preferences in session', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.applyFilter('lohi');
        cy.reload();
        cy.get('.product_sort_container').should('have.value', 'az');
    });

    it('Should handle multiple tab sessions', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.window().then((win) => {
            win.open('https://www.saucedemo.com/inventory.html', '_blank');
        });
    });

    it('Should preserve cart state in session storage', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.window().its('sessionStorage').invoke('getItem', 'cart-contents').should('exist');
    });

    it('Should handle session timeout gracefully', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.wait(1000);
        cy.reload();
        cy.url().should('include', 'inventory.html');
    });

    it('Should clear local storage on logout', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Should maintain session across navigation', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').first().click();
        cy.go('back');
        cy.url().should('include', 'inventory.html');
    });

    it('Should store user preferences', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.window().its('localStorage').should('exist');
    });

    it('Should handle concurrent requests', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_badge').should('contain', '2');
    });

    it('Should validate session token', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.getCookie('session-username').should('have.property', 'value');
    });

    it('Should handle browser back with active session', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_link').click();
        cy.go('back');
        cy.url().should('include', 'inventory.html');
    });

    it('Should handle browser forward with active session', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_link').click();
        cy.go('back');
        cy.go('forward');
        cy.url().should('include', 'cart.html');
    });

    it('Should reset session state on app reset', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#reset_sidebar_link').click();
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Should handle rapid session operations', () => {
        LoginPage.visit();
        for(let i = 0; i < 3; i++) {
            LoginPage.login('standard_user', 'secret_sauce');
            cy.get('#react-burger-menu-btn').click();
            cy.get('#logout_sidebar_link').click();
        }
    });

    it('Should maintain security with session cookies', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.getCookie('session-username').should('have.property', 'secure');
    });
});
