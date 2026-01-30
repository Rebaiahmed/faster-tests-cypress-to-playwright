const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Smoke Tests - Critical Functionality', () => {
  test('Application loads successfully', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await expect(page).toHaveURL(/.*saucedemo\.com/);
  });

  test('Login page is accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page.locator('[data-test="username"]')).toBeVisible();
  });

  test('Can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Products page loads with items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const count = await page.locator('.inventory_item').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Can add item to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.btn_inventory').first().click();
    await expect(await (new ProductPage(page)).getCartBadge()).toHaveCount(1);
  });

  test('Cart is accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Can proceed to checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.checkout_button').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('Checkout form is functional', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.checkout_button').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('Can complete an order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.checkout_button').click();
    await page.locator('[data-test="firstName"]').fill('Test');
    await page.locator('[data-test="lastName"]').fill('User');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('.btn_action').click();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
  });

  test('Can logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).not.toHaveURL(/.*inventory/);
  });

  test('Navigation menu works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu')).toBeVisible();
  });

  test('Product filtering works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.applyFilter('lohi');
    await expect(page.locator('.product_sort_container')).toHaveValue('lohi');
  });

  test('Cart count updates correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.btn_inventory').first().click();
    await expect(await (new ProductPage(page)).getCartBadge()).toContainText('1');
  });

  test('Remove from cart works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.btn_inventory').first().click();
    await expect(await productPage.getCartBadge()).not.toBeVisible();
  });

  test('Product details page accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);
  });

  test('Back to products button works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.inventory_item_name').first().click();
    await page.locator('.back-to-products').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Continue shopping button works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.btn_secondary').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Error messages display correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid', 'invalid');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Locked user cannot login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('Multiple items can be added to cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.btn_inventory').nth(0).click();
    await page.locator('.btn_inventory').nth(1).click();
    await expect(await (new ProductPage(page)).getCartBadge()).toContainText('2');
  });
});
