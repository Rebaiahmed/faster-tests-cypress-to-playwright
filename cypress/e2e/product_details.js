/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Product Details Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
    });

    it('Should display product image correctly', () => {
        cy.get('.inventory_item').first().find('img').should('be.visible');
        cy.get('.inventory_item').first().find('img').should('have.attr', 'src');
    });

    it('Should display product name', () => {
        cy.get('.inventory_item_name').first().should('be.visible');
        cy.get('.inventory_item_name').first().invoke('text').should('not.be.empty');
    });

    it('Should display product description', () => {
        cy.get('.inventory_item_desc').first().should('be.visible');
        cy.get('.inventory_item_desc').first().invoke('text').should('not.be.empty');
    });

    it('Should display product price', () => {
        cy.get('.inventory_item_price').first().should('be.visible');
        cy.get('.inventory_item_price').first().should('contain', '$');
    });

    it('Should navigate to product detail page', () => {
        cy.get('.inventory_item_name').first().click();
        cy.url().should('include', 'inventory-item.html');
    });

    it('Should display back to products button on detail page', () => {
        cy.get('.inventory_item_name').first().click();
        cy.get('.back-to-products').should('be.visible');
    });

    it('Should return to products page from detail page', () => {
        cy.get('.inventory_item_name').first().click();
        cy.get('.back-to-products').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Should add product from detail page', () => {
        cy.get('.inventory_item_name').first().click();
        cy.get('.btn_inventory').click();
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should remove product from detail page', () => {
        cy.get('.inventory_item_name').first().click();
        cy.get('.btn_inventory').click();
        cy.get('.btn_inventory').click();
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Should display all product information on detail page', () => {
        cy.get('.inventory_item_name').first().click();
        cy.get('.inventory_details_name').should('be.visible');
        cy.get('.inventory_details_desc').should('be.visible');
        cy.get('.inventory_details_price').should('be.visible');
    });

    it('Should display correct product count', () => {
        cy.get('.inventory_item').should('have.length.at.least', 1);
    });

    it('Should have valid product links', () => {
        cy.get('.inventory_item_name').each(($el) => {
            cy.wrap($el).should('have.attr', 'href');
        });
    });

    it('Should display product images with alt text', () => {
        cy.get('.inventory_item img').first().should('have.attr', 'alt');
    });

    it('Should maintain cart state when viewing product details', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('contain', '1');
        cy.get('.inventory_item_name').eq(1).click();
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Should display add to cart button on each product', () => {
        cy.get('.inventory_item').each(($el) => {
            cy.wrap($el).find('.btn_inventory').should('be.visible');
        });
    });

    it('Should change button text after adding to cart', () => {
        cy.get('.inventory_item').first().find('.btn_inventory').click();
        cy.get('.inventory_item').first().find('.btn_inventory').should('contain', 'Remove');
    });

    it('Should display product price in correct format', () => {
        cy.get('.inventory_item_price').first().invoke('text').should('match', /^\$\d+\.\d{2}$/);
    });

    it('Should allow navigation between multiple products', () => {
        cy.get('.inventory_item_name').eq(0).click();
        cy.get('.back-to-products').click();
        cy.get('.inventory_item_name').eq(1).click();
        cy.url().should('include', 'inventory-item.html');
    });

    it('Should display consistent product data', () => {
        let productName;
        cy.get('.inventory_item_name').first().invoke('text').then((text) => {
            productName = text;
            cy.get('.inventory_item_name').first().click();
            cy.get('.inventory_details_name').should('contain', productName);
        });
    });

    it('Should handle product image loading', () => {
        cy.get('.inventory_item img').first().should('be.visible').and(($img) => {
            expect($img[0].naturalWidth).to.be.greaterThan(0);
        });
    });
});
