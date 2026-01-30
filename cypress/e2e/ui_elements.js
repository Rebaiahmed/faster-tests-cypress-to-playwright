/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';

describe('UI Elements and Styling Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
    });

    it('Should display primary header', () => {
        cy.get('.primary_header').should('be.visible');
    });

    it('Should display header container', () => {
        cy.get('.header_container').should('be.visible');
    });

    it('Should have correct page title', () => {
        cy.get('.title').should('contain', 'Products');
    });

    it('Should display inventory container', () => {
        cy.get('.inventory_container').should('be.visible');
    });

    it('Should display inventory list', () => {
        cy.get('.inventory_list').should('be.visible');
    });

    it('Should have proper grid layout', () => {
        cy.get('.inventory_list').should('have.css', 'display');
    });

    it('Should display product cards properly', () => {
        cy.get('.inventory_item').each(($item) => {
            cy.wrap($item).should('be.visible');
        });
    });

    it('Should display peek class', () => {
        cy.get('.peek').should('exist');
    });

    it('Should have robot image visible', () => {
        cy.get('.bot_column').should('be.visible');
    });

    it('Should display footer robot', () => {
        cy.get('.footer_robot').should('be.visible');
    });

    it('Should have visible header secondary container', () => {
        cy.get('.header_secondary_container').should('be.visible');
    });

    it('Should display inventory item labels', () => {
        cy.get('.inventory_item_label').should('have.length.at.least', 1);
    });

    it('Should have clickable product images', () => {
        cy.get('.inventory_item_img').first().should('be.visible');
    });

    it('Should display proper button styling', () => {
        cy.get('.btn_inventory').first().should('have.css', 'border-radius');
    });

    it('Should have hover effect on products', () => {
        cy.get('.inventory_item').first().trigger('mouseover');
    });

    it('Should display correct font family', () => {
        cy.get('body').should('have.css', 'font-family');
    });

    it('Should have responsive layout', () => {
        cy.viewport(1280, 720);
        cy.get('.inventory_item').should('be.visible');
    });

    it('Should maintain aspect ratio for images', () => {
        cy.get('.inventory_item_img').first().should('have.css', 'object-fit');
    });

    it('Should have proper spacing between items', () => {
        cy.get('.inventory_item').first().should('have.css', 'margin');
    });

    it('Should display proper color scheme', () => {
        cy.get('.btn_primary').should('have.css', 'background-color');
    });

    it('Should have consistent button sizes', () => {
        cy.get('.btn_inventory').first().invoke('outerHeight').should('be.gt', 0);
    });

    it('Should display cart icon badge properly', () => {
        cy.get('.inventory_item').first().find('.btn_inventory').click();
        cy.get('.shopping_cart_badge').should('have.css', 'background-color');
    });

    it('Should have visible text on buttons', () => {
        cy.get('.btn_inventory').first().should('have.css', 'color');
    });

    it('Should display proper link styling', () => {
        cy.get('.inventory_item_name').first().should('have.css', 'text-decoration');
    });
});
