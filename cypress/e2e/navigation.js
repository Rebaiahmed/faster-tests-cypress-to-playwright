/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Navigation Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
    });

    it('Should display hamburger menu', () => {
        cy.get('#react-burger-menu-btn').should('be.visible');
    });

    it('Should open sidebar menu', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu').should('be.visible');
    });

    it('Should close sidebar menu', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.get('#react-burger-cross-btn').click();
        cy.get('.bm-menu').should('not.be.visible');
    });

    it('Should display all menu items', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-item-list').should('be.visible');
        cy.get('.bm-item').should('have.length.at.least', 1);
    });

    it('Should navigate to all items', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.get('#inventory_sidebar_link').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Should navigate to about page', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.get('#about_sidebar_link').should('be.visible');
    });

    it('Should logout successfully', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
        cy.url().should('not.include', 'inventory');
    });

    it('Should display cart icon', () => {
        cy.get('.shopping_cart_link').should('be.visible');
    });

    it('Should navigate to cart page', () => {
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', 'cart.html');
    });

    it('Should display app logo', () => {
        cy.get('.app_logo').should('be.visible');
    });

    it('Should maintain session after navigation', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.go('back');
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should display reset app state option', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.get('#reset_sidebar_link').should('be.visible');
    });

    it('Should navigate using browser back button', () => {
        cy.get('.shopping_cart_link').click();
        cy.go('back');
        cy.url().should('include', 'inventory.html');
    });

    it('Should navigate using browser forward button', () => {
        cy.get('.shopping_cart_link').click();
        cy.go('back');
        cy.go('forward');
        cy.url().should('include', 'cart.html');
    });

    it('Should display footer', () => {
        cy.get('.footer').should('be.visible');
    });

    it('Should display social media links', () => {
        cy.get('.social').should('be.visible');
    });

    it('Should have working Twitter link', () => {
        cy.get('.social_twitter').should('have.attr', 'href');
    });

    it('Should have working Facebook link', () => {
        cy.get('.social_facebook').should('have.attr', 'href');
    });

    it('Should have working LinkedIn link', () => {
        cy.get('.social_linkedin').should('have.attr', 'href');
    });

    it('Should display copyright information', () => {
        cy.get('.footer_copy').should('be.visible');
    });

    it('Should maintain menu state across navigation', () => {
        cy.get('#react-burger-menu-btn').click();
        cy.wait(500);
        cy.get('.shopping_cart_link').click();
        cy.get('.bm-menu').should('not.be.visible');
    });
});
