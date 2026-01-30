const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');
const { CartPage } = require('../../page-objects/CartPage');
const { CheckoutPage } = require('../../page-objects/CheckoutPage');

test.describe('End-to-End Integration Tests', () => {
  let loginPage, productPage, cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
  });

  test('Complete purchase flow with single item', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
  });

  test('Complete purchase flow with multiple items', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await productPage.addToCartById('sauce-labs-bolt-t-shirt');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Jane', 'Smith', '54321');
    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
  });

  test('Browse products, filter, add to cart, and checkout', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.applyFilter('lohi');
    await page.locator('.inventory_item').first().locator('.btn_inventory').click();
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Bob', 'Johnson', '99999');
    await checkoutPage.finishCheckout();
    await checkoutPage.verifySuccessMessage();
  });

  test('Add item, view details, return, and checkout', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.inventory_item_name').first().click();
    await page.locator('.btn_inventory').click();
    await page.locator('.back-to-products').click();
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Alice', 'Williams', '11111');
    await checkoutPage.finishCheckout();
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('Login, logout, and login again', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Add items, remove some, then checkout remaining', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await productPage.addToCartById('sauce-labs-bolt-t-shirt');
    await cartPage.removeItemById('sauce-labs-bike-light');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Charlie', 'Brown', '22222');
    await checkoutPage.finishCheckout();
    await expect(page.locator('.complete-header')).toContainText('Thank you');
  });

  test('Sort products, add highest price item, and checkout', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.applyFilter('hilo');
    await page.locator('.inventory_item').first().locator('.btn_inventory').click();
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('David', 'Miller', '33333');
    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
  });

  test('Navigate through all pages in sequence', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);
    await page.locator('.back-to-products').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await page.locator('.btn_secondary').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Add all items and complete checkout', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const buttons = page.locator('.btn_inventory');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Eve', 'Davis', '44444');
    await checkoutPage.finishCheckout();
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('Test complete user journey with navigation', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.applyFilter('za');
    await page.locator('.inventory_item_name').nth(2).click();
    await page.locator('.btn_inventory').click();
    await page.locator('.back-to-products').click();
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await productPage.addToCartById('sauce-labs-bike-light');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });

  test('Reset app state and verify clean slate', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#reset_sidebar_link').click();
    await page.waitForTimeout(500);
    await expect(await productPage.getCartBadge()).not.toBeVisible();
  });

  test('Complete checkout then start new shopping session', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Frank', 'Wilson', '55555');
    await checkoutPage.finishCheckout();
    await page.locator('.btn_primary').click();
    await productPage.addToCartById('sauce-labs-bike-light');
    await expect(await productPage.getCartBadge()).toContainText('1');
  });

  test('Test product detail to checkout flow', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.inventory_item_name').nth(1).click();
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await page.locator('.btn_inventory').click();
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Grace', 'Moore', '66666');
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
  });

  test('Cancel checkout and resume shopping', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await page.locator('.cart_cancel_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await page.locator('.btn_secondary').click();
    await productPage.addToCartById('sauce-labs-bike-light');
    await expect(await productPage.getCartBadge()).toContainText('2');
  });

  test('Verify order summary displays correct information', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('Henry', 'Taylor', '77777');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('Test rapid add/remove cart operations', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await cartPage.removeItemById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bolt-t-shirt');
    await cartPage.removeItemById('sauce-labs-bike-light');
    await productPage.addToCartById('sauce-labs-fleece-jacket');
    await expect(await productPage.getCartBadge()).toContainText('2');
  });

  test('Complete workflow with different user types', async ({ page }) => {
    for (const user of ['standard_user', 'problem_user', 'performance_glitch_user']) {
      await loginPage.goto();
      await loginPage.login(user, 'secret_sauce');
      await expect(page).toHaveURL(/.*inventory\.html/);
      await page.locator('#react-burger-menu-btn').click();
      await page.locator('#logout_sidebar_link').click();
    }
  });

  test('Verify cart persistence across navigation', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.inventory_item_name').first().click();
    await expect(await productPage.getCartBadge()).toContainText('1');
    await page.locator('.back-to-products').click();
    await expect(await productPage.getCartBadge()).toContainText('1');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('Test menu navigation across different pages', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu')).toBeVisible();
    await page.locator('#react-burger-cross-btn').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu')).toBeVisible();
  });

  test('Verify product information consistency', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const productName = await page.locator('.inventory_item').first().locator('.inventory_item_name').textContent();
    const productPrice = await page.locator('.inventory_item').first().locator('.inventory_item_price').textContent();
    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('.inventory_details_name')).toContainText(productName.trim());
    await expect(page.locator('.inventory_details_price')).toContainText(productPrice.trim());
  });
});
