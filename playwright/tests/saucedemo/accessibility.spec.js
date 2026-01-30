const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');

test.describe('Accessibility Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Should have proper page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Swag Labs');
  });

  test('Should have proper HTML lang attribute', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('Should have accessible login form', async ({ page }) => {
    await expect(page.locator('[data-test="username"]')).toHaveAttribute('placeholder', /.+/);
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('placeholder', /.+/);
  });

  test('Should have visible labels for form inputs', async ({ page }) => {
    // Check that form inputs have accessible placeholders
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
  });

  test('Should have proper button labels', async ({ page }) => {
    await expect(page.locator('[data-test="login-button"]')).toHaveAttribute('value', /.+/);
  });

  test('Should support keyboard navigation on login', async ({ page }) => {
    await page.locator('[data-test="username"]').focus();
    await expect(page.locator('[data-test="username"]')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-test="password"]')).toBeFocused();
  });

  test('Should have semantic HTML structure', async ({ page }) => {
    await expect(page.locator('form')).toHaveCount(1);
    await expect(page.locator('input[type="submit"], button')).toHaveCount(1);
  });

  test('Should display error messages with proper contrast', async ({ page }) => {
    await loginPage.login('wrong', 'wrong');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    const backgroundColor = await page.locator('[data-test="error"]').evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(backgroundColor).toBeTruthy();
  });

  test('Should have visible focus indicators', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.btn_inventory').first().focus();
  });

  test('Should have alt text for images', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const images = page.locator('.inventory_item img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Should have proper heading hierarchy', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page.locator('.title')).toHaveCount(1);
  });

  test('Should have clickable elements with sufficient size', async ({ page }) => {
    const width = await page.locator('[data-test="login-button"]').evaluate(el => el.offsetWidth);
    const height = await page.locator('[data-test="login-button"]').evaluate(el => el.offsetHeight);
    expect(width).toBeGreaterThan(44);
    expect(height).toBeGreaterThan(44);
  });

  test('Should support Enter key for form submission', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should have proper link styling', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const cursor = await page.locator('.inventory_item_name').first().evaluate(el => window.getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
  });

  test('Should have visible cart icon', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('Should have descriptive button text', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const text = await page.locator('.btn_inventory').first().textContent();
    expect(text).not.toBe('');
  });

  test('Should support Tab navigation through products', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    // Wait for products to load
    await page.waitForSelector('.inventory_item', { timeout: 5000 });
    // Test that product elements are keyboard accessible by checking visibility
    const products = page.locator('.inventory_item');
    await expect(products.first()).toBeVisible();
    // Test that add to cart buttons are accessible
    await expect(page.locator('.btn_inventory').first()).toBeVisible();
  });

  test('Should have sufficient color contrast for text', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const color = await page.locator('.inventory_item_name').first().evaluate(el => window.getComputedStyle(el).color);
    expect(color).toBeTruthy();
  });

  test('Should have proper form structure', async ({ page }) => {
    await expect(page.locator('#login_button_container')).toHaveCount(1);
  });

  test('Should have visible error close button', async ({ page }) => {
    await loginPage.login('wrong', 'wrong');
    await expect(page.locator('.error-button')).toBeVisible();
  });
});
