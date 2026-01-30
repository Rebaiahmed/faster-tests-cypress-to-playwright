/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';

describe('Performance Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
    });

    it('Should load login page within acceptable time', () => {
        cy.window().then((win) => {
            const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
            expect(loadTime).to.be.lessThan(5000);
        });
    });

    it('Should login within reasonable time', () => {
        const start = Date.now();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html').then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(3000);
        });
    });

    it('Should load inventory page quickly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.window().then((win) => {
            const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
            expect(loadTime).to.be.lessThan(5000);
        });
    });

    it('Should add items to cart quickly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        const start = Date.now();
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_badge').should('contain', '1').then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(1000);
        });
    });

    it('Should load cart page quickly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        const start = Date.now();
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', 'cart.html').then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(2000);
        });
    });

    it('Should handle rapid clicks efficiently', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        for(let i = 0; i < 10; i++) {
            cy.get('.btn_inventory').first().click();
        }
        cy.get('.shopping_cart_badge').should('exist');
    });

    it('Should filter products quickly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        const start = Date.now();
        ProductPage.applyFilter('lohi');
        cy.get('.product_sort_container').should('have.value', 'lohi').then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(1000);
        });
    });

    it('Should navigate between pages smoothly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.shopping_cart_link').click();
        cy.get('.btn_secondary').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Should handle multiple products loading', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item').should('have.length.at.least', 6);
        cy.get('.inventory_item img').each(($img) => {
            cy.wrap($img).should('be.visible');
        });
    });

    it('Should load product details quickly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        const start = Date.now();
        cy.get('.inventory_item_name').first().click();
        cy.url().should('include', 'inventory-item.html').then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(2000);
        });
    });

    it('Should handle performance_glitch_user', () => {
        const start = Date.now();
        LoginPage.login('performance_glitch_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html').then(() => {
            const duration = Date.now() - start;
            cy.log(`Performance glitch user login took: ${duration}ms`);
        });
    });

    it('Should load images efficiently', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item img').should('be.visible').and(($imgs) => {
            $imgs.each((i, img) => {
                expect(img.naturalWidth).to.be.greaterThan(0);
            });
        });
    });

    it('Should maintain performance with full cart', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.btn_inventory').each(($btn) => {
            cy.wrap($btn).click();
        });
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length.at.least', 6);
    });

    it('Should checkout quickly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        const start = Date.now();
        cy.get('.checkout_button').click();
        cy.url().should('include', 'checkout-step-one.html').then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(2000);
        });
    });

    it('Should handle menu animations smoothly', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu').should('be.visible');
        cy.get('#react-burger-cross-btn').click();
    });

    it('Should sort products efficiently', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        const start = Date.now();
        ProductPage.applyFilter('hilo');
        ProductPage.applyFilter('lohi');
        ProductPage.applyFilter('az');
        ProductPage.applyFilter('za');
        cy.get('.product_sort_container').should('have.value', 'za').then(() => {
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(3000);
        });
    });
});
