/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Responsive Design Tests', () => {
    const viewports = [
        { width: 1920, height: 1080, name: 'Desktop HD' },
        { width: 1366, height: 768, name: 'Laptop' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 375, height: 667, name: 'Mobile' }
    ];

    viewports.forEach((viewport) => {
        describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
            beforeEach(() => {
                cy.viewport(viewport.width, viewport.height);
                LoginPage.visit();
                LoginPage.login('standard_user', 'secret_sauce');
            });

            it('Should display inventory items', () => {
                cy.get('.inventory_item').should('be.visible');
            });

            it('Should display cart icon', () => {
                cy.get('.shopping_cart_link').should('be.visible');
            });

            it('Should display menu button', () => {
                cy.get('#react-burger-menu-btn').should('be.visible');
            });

            it('Should be able to add items to cart', () => {
                cy.get('.btn_inventory').first().click();
                cy.get('.shopping_cart_badge').should('contain', '1');
            });

            it('Should navigate to cart', () => {
                cy.get('.shopping_cart_link').click();
                cy.url().should('include', 'cart.html');
            });
        });
    });

    it('Should adapt layout on window resize', () => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.viewport(1920, 1080);
        cy.get('.inventory_item').should('be.visible');
        cy.viewport(375, 667);
        cy.get('.inventory_item').should('be.visible');
    });

    it('Should maintain functionality on portrait orientation', () => {
        cy.viewport(768, 1024);
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should maintain functionality on landscape orientation', () => {
        cy.viewport(1024, 768);
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should display footer on all screen sizes', () => {
        [375, 768, 1366, 1920].forEach((width) => {
            cy.viewport(width, 1080);
            LoginPage.visit();
            LoginPage.login('standard_user', 'secret_sauce');
            cy.get('.footer').should('exist');
        });
    });

    it('Should handle mobile menu interactions', () => {
        cy.viewport(375, 667);
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu').should('be.visible');
    });
});
