/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';
import CartPage from '../pageObjects/cartPage.js';
import CheckOutPage from '../pageObjects/checkoutPage.js';

describe('End-to-End Integration Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
    });

    it('Complete purchase flow with single item', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        CheckOutPage.finishCheckout();
        cy.url().should('include', 'checkout-complete.html');
    });

    it('Complete purchase flow with multiple items', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        ProductPage.addToCartById('sauce-labs-bolt-t-shirt');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Jane', 'Smith', '54321');
        CheckOutPage.finishCheckout();
        cy.url().should('include', 'checkout-complete.html');
    });

    it('Browse products, filter, add to cart, and checkout', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.applyFilter('lohi');
        cy.get('.inventory_item').first().find('.btn_inventory').click();
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Bob', 'Johnson', '99999');
        CheckOutPage.finishCheckout();
        CheckOutPage.verifySuccessMessage();
    });

    it('Add item, view details, return, and checkout', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').first().click();
        cy.get('.btn_inventory').click();
        cy.get('.back-to-products').click();
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Alice', 'Williams', '11111');
        CheckOutPage.finishCheckout();
        cy.get('.complete-header').should('be.visible');
    });

    it('Login, logout, and login again', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();
        LoginPage.login('standard_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html');
    });

    it('Add items, remove some, then checkout remaining', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        ProductPage.addToCartById('sauce-labs-bolt-t-shirt');
        CartPage.removeItemById('sauce-labs-bike-light');
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 2);
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Charlie', 'Brown', '22222');
        CheckOutPage.finishCheckout();
        cy.get('.complete-header').should('contain', 'Thank you');
    });

    it('Sort products, add highest price item, and checkout', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.applyFilter('hilo');
        cy.get('.inventory_item').first().find('.btn_inventory').click();
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('David', 'Miller', '33333');
        CheckOutPage.finishCheckout();
        cy.url().should('include', 'checkout-complete.html');
    });

    it('Navigate through all pages in sequence', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.url().should('include', 'inventory.html');
        cy.get('.inventory_item_name').first().click();
        cy.url().should('include', 'inventory-item.html');
        cy.get('.back-to-products').click();
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', 'cart.html');
        cy.get('.btn_secondary').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Add all items and complete checkout', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.btn_inventory').each(($btn) => {
            cy.wrap($btn).click();
        });
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Eve', 'Davis', '44444');
        CheckOutPage.finishCheckout();
        cy.get('.complete-header').should('be.visible');
    });

    it('Test complete user journey with navigation', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.applyFilter('za');
        cy.get('.inventory_item_name').eq(2).click();
        cy.get('.btn_inventory').click();
        cy.get('.back-to-products').click();
        cy.get('.shopping_cart_link').click();
        cy.go('back');
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 2);
    });

    it('Reset app state and verify clean slate', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('#react-burger-menu-btn').click();
        cy.get('#reset_sidebar_link').click();
        cy.wait(500);
        cy.get('.shopping_cart_badge').should('not.exist');
    });

    it('Complete checkout then start new shopping session', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Frank', 'Wilson', '55555');
        CheckOutPage.finishCheckout();
        cy.get('.btn_primary').click();
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_badge').should('contain', '1');
    });

    it('Test product detail to checkout flow', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('.inventory_item_name').eq(1).click();
        cy.get('.inventory_details_name').should('be.visible');
        cy.get('.btn_inventory').click();
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Grace', 'Moore', '66666');
        cy.get('.summary_subtotal_label').should('be.visible');
    });

    it('Cancel checkout and resume shopping', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        cy.get('.cart_cancel_link').click();
        cy.url().should('include', 'cart.html');
        cy.get('.btn_secondary').click();
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_badge').should('contain', '2');
    });

    it('Verify order summary displays correct information', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        cy.get('.shopping_cart_link').click();
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('Henry', 'Taylor', '77777');
        cy.get('.cart_item').should('have.length', 2);
        cy.get('.summary_subtotal_label').should('be.visible');
        cy.get('.summary_tax_label').should('be.visible');
        cy.get('.summary_total_label').should('be.visible');
    });

    it('Test rapid add/remove cart operations', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bike-light');
        CartPage.removeItemById('sauce-labs-backpack');
        ProductPage.addToCartById('sauce-labs-bolt-t-shirt');
        CartPage.removeItemById('sauce-labs-bike-light');
        ProductPage.addToCartById('sauce-labs-fleece-jacket');
        cy.get('.shopping_cart_badge').should('contain', '2');
    });

    it('Complete workflow with different user types', () => {
        ['standard_user', 'problem_user', 'performance_glitch_user'].forEach((user) => {
            LoginPage.visit();
            LoginPage.login(user, 'secret_sauce');
            cy.url().should('include', 'inventory.html');
            cy.get('#react-burger-menu-btn').click();
            cy.get('#logout_sidebar_link').click();
        });
    });

    it('Verify cart persistence across navigation', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.inventory_item_name').first().click();
        cy.get('.shopping_cart_badge').should('contain', '1');
        cy.get('.back-to-products').click();
        cy.get('.shopping_cart_badge').should('contain', '1');
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 1');
    });

    it('Test menu navigation across different pages', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu').should('be.visible');
        cy.get('#react-burger-cross-btn').click();
        cy.get('.shopping_cart_link').click();
        cy.get('#react-burger-menu-btn').click();
        cy.get('.bm-menu').should('be.visible');
    });

    it('Verify product information consistency', () => {
        LoginPage.login('standard_user', 'secret_sauce');
        let productName, productPrice;
        cy.get('.inventory_item').first().find('.inventory_item_name').invoke('text').then((name) => {
            productName = name;
            cy.get('.inventory_item').first().find('.inventory_item_price').invoke('text').then((price) => {
                productPrice = price;
                cy.get('.inventory_item_name').first().click();
                cy.get('.inventory_details_name').should('contain', productName);
                cy.get('.inventory_details_price').should('contain', productPrice);
            });
        });
    });
});
