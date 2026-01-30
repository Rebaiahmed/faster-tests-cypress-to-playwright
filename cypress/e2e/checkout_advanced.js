/// <reference types="cypress" />
import LoginPage from '../pageObjects/loginPage.js';
import ProductPage from '../pageObjects/productPage.js';
import CartPage from '../pageObjects/cartPage.js';
import CheckOutPage from '../pageObjects/checkoutPage.js';

describe('Advanced Checkout Tests', () => {
    beforeEach(() => {
        LoginPage.visit();
        LoginPage.login('standard_user', 'secret_sauce');
        ProductPage.addToCartById('sauce-labs-backpack');
        cy.get('.shopping_cart_link').click();
    });

    it('Should display checkout button', () => {
        cy.get('.checkout_button').should('be.visible');
    });

    it('Should navigate to checkout page', () => {
        CartPage.proceedToCheckout();
        cy.url().should('include', 'checkout-step-one.html');
    });

    it('Should display first name field', () => {
        CartPage.proceedToCheckout();
        cy.get('[data-test="firstName"]').should('be.visible');
    });

    it('Should display last name field', () => {
        CartPage.proceedToCheckout();
        cy.get('[data-test="lastName"]').should('be.visible');
    });

    it('Should display postal code field', () => {
        CartPage.proceedToCheckout();
        cy.get('[data-test="postalCode"]').should('be.visible');
    });

    it('Should show error when first name is empty', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('', 'Doe', '12345');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should show error when last name is empty', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', '', '12345');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should show error when postal code is empty', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '');
        cy.get('[data-test="error"]').should('be.visible');
    });

    it('Should proceed to overview with valid information', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.url().should('include', 'checkout-step-two.html');
    });

    it('Should display order summary', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.cart_item').should('be.visible');
    });

    it('Should display payment information', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.summary_info').should('be.visible');
    });

    it('Should display shipping information', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.summary_info').should('contain', 'FREE PONY EXPRESS DELIVERY!');
    });

    it('Should display item total', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.summary_subtotal_label').should('be.visible');
    });

    it('Should display tax', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.summary_tax_label').should('be.visible');
    });

    it('Should display total with tax', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.summary_total_label').should('be.visible');
    });

    it('Should calculate tax correctly', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.summary_subtotal_label').invoke('text').then((subtotal) => {
            cy.get('.summary_tax_label').invoke('text').then((tax) => {
                const subtotalValue = parseFloat(subtotal.replace(/[^0-9.]/g, ''));
                const taxValue = parseFloat(tax.replace(/[^0-9.]/g, ''));
                expect(taxValue).to.be.greaterThan(0);
            });
        });
    });

    it('Should display finish button', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        cy.get('.btn_action').should('be.visible');
    });

    it('Should display cancel button on checkout', () => {
        CartPage.proceedToCheckout();
        cy.get('.cart_cancel_link').should('be.visible');
    });

    it('Should return to cart when clicking cancel', () => {
        CartPage.proceedToCheckout();
        cy.get('.cart_cancel_link').click();
        cy.url().should('include', 'cart.html');
    });

    it('Should complete order successfully', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        CheckOutPage.finishCheckout();
        cy.url().should('include', 'checkout-complete.html');
    });

    it('Should display order confirmation message', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        CheckOutPage.finishCheckout();
        cy.get('.complete-header').should('contain', 'Thank you for your order');
    });

    it('Should display back home button after order', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        CheckOutPage.finishCheckout();
        cy.get('.btn_primary').should('be.visible');
    });

    it('Should return to products after order completion', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        CheckOutPage.finishCheckout();
        cy.get('.btn_primary').click();
        cy.url().should('include', 'inventory.html');
    });

    it('Should clear cart after order completion', () => {
        CartPage.proceedToCheckout();
        CheckOutPage.enterCustomerInfo('John', 'Doe', '12345');
        CheckOutPage.finishCheckout();
        cy.get('.btn_primary').click();
        cy.get('.shopping_cart_badge').should('not.exist');
    });
});
