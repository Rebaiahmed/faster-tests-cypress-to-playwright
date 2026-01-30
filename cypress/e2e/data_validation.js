/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Data Validation Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
    });

    it('Should validate product names are not empty', () => {
        cy.get('.inventory_item_name').each(($name) => {
            cy.wrap($name).invoke('text').should('not.be.empty');
        });
    });

    it('Should validate product prices are numeric', () => {
        cy.get('.inventory_item_price').each(($price) => {
            cy.wrap($price).invoke('text').then((text) => {
                const price = parseFloat(text.replace('$', ''));
                expect(price).to.be.a('number');
                expect(price).to.be.greaterThan(0);
            });
        });
    });

    it('Should validate all product images have valid sources', () => {
        cy.get('.inventory_item img').each(($img) => {
            cy.wrap($img).should('have.attr', 'src').and('not.be.empty');
        });
    });

    it('Should validate cart badge displays only numbers', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').invoke('text').should('match', /^\d+$/);
    });

    it('Should validate product descriptions are meaningful', () => {
        cy.get('.inventory_item_desc').each(($desc) => {
            cy.wrap($desc).invoke('text').then((text) => {
                expect(text.length).to.be.greaterThan(10);
            });
        });
    });

    it('Should validate URLs are properly formatted', () => {
        cy.url().should('match', /^https?:\/\/.+/);
    });

    it('Should validate footer links have href attributes', () => {
        cy.get('.social a').each(($link) => {
            cy.wrap($link).should('have.attr', 'href').and('not.be.empty');
        });
    });

    it('Should validate product IDs are consistent', () => {
        cy.get('[data-test]').each(($el) => {
            cy.wrap($el).should('have.attr', 'data-test').and('not.be.empty');
        });
    });

    it('Should validate button states change appropriately', () => {
        cy.get('.btn_inventory').first().should('contain', 'Add to cart');
        cy.get('.btn_inventory').first().click();
        cy.get('.btn_inventory').first().should('contain', 'Remove');
    });

    it('Should validate form inputs accept text', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.checkout_button').click();
        cy.get('[data-test="firstName"]').type('TestData123');
        cy.get('[data-test="firstName"]').should('have.value', 'TestData123');
    });

    it('Should validate total price calculation is accurate', () => {
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        cy.get('.checkout_button').click();
        cy.get('[data-test="firstName"]').type('John');
        cy.get('[data-test="lastName"]').type('Doe');
        cy.get('[data-test="postalCode"]').type('12345');
        cy.get('[data-test="continue"]').click();
        
        cy.get('.summary_subtotal_label').invoke('text').then((subtotal) => {
            cy.get('.summary_tax_label').invoke('text').then((tax) => {
                cy.get('.summary_total_label').invoke('text').then((total) => {
                    const subtotalValue = parseFloat(subtotal.replace(/[^0-9.]/g, ''));
                    const taxValue = parseFloat(tax.replace(/[^0-9.]/g, ''));
                    const totalValue = parseFloat(total.replace(/[^0-9.]/g, ''));
                    expect(totalValue).to.equal(subtotalValue + taxValue);
                });
            });
        });
    });
});
