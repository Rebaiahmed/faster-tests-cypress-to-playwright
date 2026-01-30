/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Smoke Tests - Critical Functionality', () => {
    it('Application loads successfully', () => {
        cy.visit('https://www.saucedemo.com');
        cy.url().should('include', 'saucedemo.com');
    });

    it('Login page is accessible', () => {
        LoginPage.visit();
        cy.get('[data-test="username"]').should('be.visible');
    });

    it('Can login with valid credentials', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html');
    });

    it('Products page loads with items', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item').should('have.length.at.least', 1);
    });

    it('Can add item to cart', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.btn_inventory').first().click();
        cy.get('.shopping_cart_badge').should('exist');
    });

    it('Cart is accessible', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', 'cart.html');
    });

    it('Can proceed to checkout', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.checkout_button').click();
        cy.url().should('include', 'checkout-step-one.html');
    });

    it('Checkout form is functional', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.checkout_button').click();
        cy.get('[data-test="firstName"]').type('Test');
        cy.get('[data-test="lastName"]').type('User');
        cy.get('[data-test="postalCode"]').type('12345');
        cy.get('[data-test="continue"]').click();
        cy.url().should('include', 'checkout-step-two.html');
    });

    it('Can complete an order', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.checkout_button').click();
        cy.get('[data-test="firstName"]').type('Test');
        cy.get('[data-test="lastName"]').type('User');
        cy.get('[data-test="postalCode"]').type('12345');
        cy.get('[data-test="continue"]').click();
        cy.get('.btn_action').click();
        cy.url().should('include', 'checkout-complete.html');
    });

    it('Can logout successfully', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
        cy.url().should('not.include', 'inventory');
    });

    it('Navigation menu works', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu').should('be.visible');
    });

    it('Product filtering works', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.applyFilter('lohi');
        cy.get('.product_sort_container').should('have.value', 'lohi');
    });

    it('Cart count updates correctly', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.btn_inventory').first().click();
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Remove from cart works', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.btn_inventory').first().click();
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Product details page accessible', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').first().click();
        cy.url().should('include', 'inventory-item.html');
    });

    it('Back to products button works', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').first().click();
        cy.get('.back-to-products').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Continue shopping button works', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_link').click();
        cy.get('.btn_secondary').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Error messages display correctly', () => {
        LoginPage.visit();
        LoginPage.login('invalid', 'invalid');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Locked user cannot login', () => {
        LoginPage.visit();
        LoginPage.login('locked_out_user', 'secret_sauce');
        cy.get('[data-test="error"]').should('contain', 'locked out');
    });

    it('Multiple items can be added to cart', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.btn_inventory').eq(0).click();
        cy.get('.btn_inventory').eq(1).click();
        cy.get('.shopping_cart_badge').should('contain', '2');
    });
});
