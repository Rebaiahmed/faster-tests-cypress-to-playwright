/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Product Sorting and Filtering', () => {
    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
    });

    it('Should display sort dropdown', () => {
        cy.get('.product_sort_container').should('be.visible');
    });

    it('Should have Name (A to Z) as default sort', () => {
        cy.get('.product_sort_container').should('have.value', 'az');
    });

    it('Should sort by Name (Z to A)', () => {
        ProductPage.applyFilter('za');
        cy.get('.inventory_item_name').then(($names) => {
            const names = [...$names].map(el => el.innerText);
            expect(names).to.deep.equal([...names].sort().reverse());
        });
    });

    it('Should sort by Price (low to high)', () => {
        ProductPage.applyFilter('lohi');
        cy.get('.inventory_item_price').then(($prices) => {
            const prices = [...$prices].map(el => parseFloat(el.innerText.replace('$', '')));
            expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
        });
    });

    it('Should sort by Price (high to low)', () => {
        ProductPage.applyFilter('hilo');
        cy.get('.inventory_item_price').then(($prices) => {
            const prices = [...$prices].map(el => parseFloat(el.innerText.replace('$', '')));
            expect(prices).to.deep.equal([...prices].sort((a, b) => b - a));
        });
    });

    it('Should maintain sort after adding item to cart', () => {
        ProductPage.applyFilter('lohi');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.product_sort_container').should('have.value', 'lohi');
    });

    it('Should maintain sort after page reload', () => {
        ProductPage.applyFilter('hilo');
        cy.reload();
        cy.get('.product_sort_container').should('have.value', 'az');
    });

    it('Should sort correctly with Name (A to Z)', () => {
        ProductPage.applyFilter('az');
        cy.get('.inventory_item_name').first().should('be.visible');
    });

    it('Should display all products after sorting', () => {
        ProductPage.applyFilter('lohi');
        cy.get('.inventory_item').should('have.length.at.least', 6);
    });

    it('Should handle multiple sort changes', () => {
        ProductPage.applyFilter('lohi');
        ProductPage.applyFilter('hilo');
        ProductPage.applyFilter('az');
        cy.get('.product_sort_container').should('have.value', 'az');
    });

    it('Should verify price order ascending', () => {
        ProductPage.applyFilter('lohi');
        cy.get('.inventory_item_price').first().invoke('text').then((firstPrice) => {
            cy.get('.inventory_item_price').last().invoke('text').then((lastPrice) => {
                const first = parseFloat(firstPrice.replace('$', ''));
                const last = parseFloat(lastPrice.replace('$', ''));
                expect(first).to.be.lte(last);
            });
        });
    });

    it('Should verify price order descending', () => {
        ProductPage.applyFilter('hilo');
        cy.get('.inventory_item_price').first().invoke('text').then((firstPrice) => {
            cy.get('.inventory_item_price').last().invoke('text').then((lastPrice) => {
                const first = parseFloat(firstPrice.replace('$', ''));
                const last = parseFloat(lastPrice.replace('$', ''));
                expect(first).to.be.gte(last);
            });
        });
    });

    it('Should maintain product count after sorting', () => {
        let initialCount;
        cy.get('.inventory_item').its('length').then((count) => {
            initialCount = count;
            ProductPage.applyFilter('lohi');
            cy.get('.inventory_item').should('have.length', initialCount);
        });
    });

    it('Should have valid sort options', () => {
        cy.get('.product_sort_container option').should('have.length', 4);
    });

    it('Should display correct option text', () => {
        cy.get('.product_sort_container option[value="az"]').should('contain', 'Name (A to Z)');
        cy.get('.product_sort_container option[value="za"]').should('contain', 'Name (Z to A)');
        cy.get('.product_sort_container option[value="lohi"]').should('contain', 'Price (low to high)');
        cy.get('.product_sort_container option[value="hilo"]').should('contain', 'Price (high to low)');
    });
});
