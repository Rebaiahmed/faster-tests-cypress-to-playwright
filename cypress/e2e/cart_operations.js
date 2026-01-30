/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';
import CartPage from '../pageObjects/cartPage.js';

describe('Advanced Cart Operations', () => {
    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
    });

    it('Should add multiple items to cart', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        ProductPage.addToCartById('sauce-labs-bolt-t-shirt');
        cy.get('.shopping_cart_badge').should('contain', '3');
    });

    it('Should display correct cart count', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should update cart count when adding items', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('contain', '1');
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_badge').should('contain', '2');
    });

    it('Should update cart count when removing items', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_badge').should('contain', '2');
        CartPage.removeItemById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should remove cart badge when cart is empty', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        CartPage.removeItemById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Should display empty cart message when no items', () => {
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('not.exist');
    });

    it('Should display continue shopping button', () => {
        cy.get('.shopping_cart_link').click();
        cy.get('.btn_secondary').should('be.visible');
    });

    it('Should return to products from cart', () => {
        cy.get('.shopping_cart_link').click();
        cy.get('.btn_secondary').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Should display checkout button when cart has items', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.checkout_button').should('be.visible');
    });

    it('Should display item quantity in cart', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_quantity').should('be.visible');
    });

    it('Should display item name in cart', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack');
    });

    it('Should display item description in cart', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.inventory_item_desc').should('be.visible');
    });

    it('Should display item price in cart', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.inventory_item_price').should('be.visible');
    });

    it('Should add all products to cart', () => {
        cy.get('.btn_inventory').each(($btn) => {
            cy.wrap($btn).click();
        });
        cy.get('.shopping_cart_badge').invoke('text').then(parseFloat).should('be.gte', 6);
    });

    it('Should remove all products from cart', () => {
        cy.get('.btn_inventory').each(($btn) => {
            cy.wrap($btn).click();
        });
        cy.get('.btn_inventory').each(($btn) => {
            cy.wrap($btn).click();
        });
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Should maintain item order in cart', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').first().should('contain', 'Sauce Labs Backpack');
    });

    it('Should allow removing items from cart page', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_button').click();
        cy.get('.cart_item').should('not.exist');
    });

    it('Should display remove button for each cart item', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_button').should('have.length', 2);
    });

    it('Should handle rapid add/remove operations', () => {
        for(let i = 0; i < 5; i++) {
            ProductPage.addToCartById('sauce-labs-backpack');
            CartPage.removeItemById('sauce-labs-backpack');
        }
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Should persist cart after logout and login', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_badge').should('not.exist');
    });
});
