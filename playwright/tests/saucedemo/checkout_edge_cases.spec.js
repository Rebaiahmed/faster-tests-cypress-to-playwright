const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');
const { CartPage } = require('../../page-objects/CartPage');
const { CheckoutPage } = require('../../page-objects/CheckoutPage');

test.describe('Checkout Edge Cases', () => {
  let loginPage, productPage, cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should prevent checkout with an empty cart', async ({ page }) => {
    await productPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(page.locator('.error-message-container')).toContainText('Your cart is empty');
  });

  test('Should prevent checkout without name input', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('.btn_inventory').click();
    await productPage.openCart();
    await cartPage.proceedToCheckout();
    
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.error-message-container')).toContainText('Error: First Name is required');
  });

  test('Should prevent checkout with invalid ZIP Code', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('.btn_inventory').click();
    await productPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.enterCustomerInfo('Kurt', 'Cox', 'ABC123');
    await expect(page.locator('.error-message-container')).toContainText('Error: Postal Code must be numeric');
  });

  test('Should retain cart items after failed checkout attempt', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('.btn_inventory').click();
    await productPage.openCart();
    await cartPage.proceedToCheckout();
    
    await page.reload();
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
  });
});
