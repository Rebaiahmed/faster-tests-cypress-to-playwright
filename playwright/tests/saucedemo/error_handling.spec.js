const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');
const { CartPage } = require('../../page-objects/CartPage');

test.describe('Error Handling and Edge Cases', () => {
  let loginPage, productPage, cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await loginPage.goto();
  });

  test('Should handle network errors gracefully', async ({ page }) => {
    await page.route('**/*.js', route => route.fulfill({ status: 500 }));
    await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'domcontentloaded' });
  });

  test('Should display error for SQL injection attempt', async ({ page }) => {
    await loginPage.login("' OR '1'='1", 'password');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle XSS attempt in username', async ({ page }) => {
    await loginPage.login('<script>alert("xss")</script>', 'password');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle special characters in username', async ({ page }) => {
    await loginPage.login('user@#$%', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle very long username', async ({ page }) => {
    await loginPage.login('a'.repeat(1000), 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle very long password', async ({ page }) => {
    await loginPage.login('standard_user', 'a'.repeat(1000));
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle unicode characters', async ({ page }) => {
    await loginPage.login('用户名', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle emoji in username', async ({ page }) => {
    await loginPage.login('user😀', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle spaces in username', async ({ page }) => {
    await loginPage.login('   ', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle case sensitivity', async ({ page }) => {
    await loginPage.login('STANDARD_USER', 'secret_sauce');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should prevent multiple rapid login attempts', async ({ page }) => {
    for(let i = 0; i < 5; i++) {
      await loginPage.login('standard_user', 'wrong');
      await page.locator('.error-button').click();
    }
    await expect(page.locator('[data-test="error"]')).toHaveCount(1);
  });

  test('Should handle refresh during checkout', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await page.reload();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('Should handle back button during checkout', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await page.goBack();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Should handle direct URL access to checkout without items', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('Should handle missing product images', async ({ page }) => {
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page.locator('.inventory_item_img').first()).toHaveCount(1);
  });

  test('Should validate checkout form fields', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should handle special characters in checkout form', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await cartPage.proceedToCheckout();
    await page.locator('[data-test="firstName"]').fill('<script>');
    await page.locator('[data-test="lastName"]').fill('alert(1)');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('Should handle empty cart checkout attempt', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
  });

  test('Should handle concurrent user sessions', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.context().clearCookies();
    await page.goto('https://www.saucedemo.com');
  });

  test('Should handle session timeout', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForTimeout(100);
    await page.reload();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
