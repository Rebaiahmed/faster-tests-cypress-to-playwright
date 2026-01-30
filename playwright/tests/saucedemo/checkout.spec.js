const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');
const { CartPage } = require('../../page-objects/CartPage');
const { CheckoutPage } = require('../../page-objects/CheckoutPage');

test.describe('Saucedemo - Checkout Process Test', () => {
  let loginPage, productPage, cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should complete the checkout process successfully', async ({ page }) => {
    const items = await productPage.getInventoryItems();
    await items.first().locator('.btn_inventory').click();
    await productPage.openCart();
    
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('kurt', 'Cox', '12345');
    
    await expect(page.locator('.summary_total_label')).toBeVisible();
    await checkoutPage.finishCheckout();
    
    await checkoutPage.verifySuccessMessage();
  });
});
