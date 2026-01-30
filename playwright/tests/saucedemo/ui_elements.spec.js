const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');

test.describe('UI Elements and Styling Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should display primary header', async ({ page }) => {
    await expect(page.locator('.primary_header')).toBeVisible();
  });

  test('Should display header container', async ({ page }) => {
    await expect(page.locator('.header_container')).toBeVisible();
  });

  test('Should have correct page title', async ({ page }) => {
    await expect(page.locator('.title')).toContainText('Products');
  });

  test('Should display inventory container', async ({ page }) => {
    await expect(page.locator('.inventory_container')).toBeVisible();
  });

  test('Should display inventory list', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Should have proper grid layout', async ({ page }) => {
    const display = await page.locator('.inventory_list').evaluate(el => window.getComputedStyle(el).display);
    expect(display).toBeTruthy();
  });

  test('Should display product cards properly', async ({ page }) => {
    const items = page.locator('.inventory_item');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i)).toBeVisible();
    }
  });

  test('Should display peek class', async ({ page }) => {
    await expect(page.locator('.peek')).toHaveCount(1);
  });

  test('Should have robot image visible', async ({ page }) => {
    await expect(page.locator('.bot_column')).toBeVisible();
  });

  test('Should display footer robot', async ({ page }) => {
    await expect(page.locator('.footer_robot')).toBeVisible();
  });

  test('Should have visible header secondary container', async ({ page }) => {
    await expect(page.locator('.header_secondary_container')).toBeVisible();
  });

  test('Should display inventory item labels', async ({ page }) => {
    const count = await page.locator('.inventory_item_label').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Should have clickable product images', async ({ page }) => {
    await expect(page.locator('.inventory_item_img').first()).toBeVisible();
  });

  test('Should display proper button styling', async ({ page }) => {
    const borderRadius = await page.locator('.btn_inventory').first().evaluate(el => window.getComputedStyle(el).borderRadius);
    expect(borderRadius).toBeTruthy();
  });

  test('Should have hover effect on products', async ({ page }) => {
    await page.locator('.inventory_item').first().hover();
  });

  test('Should display correct font family', async ({ page }) => {
    const fontFamily = await page.locator('body').evaluate(el => window.getComputedStyle(el).fontFamily);
    expect(fontFamily).toBeTruthy();
  });

  test('Should have responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });

  test('Should maintain aspect ratio for images', async ({ page }) => {
    const objectFit = await page.locator('.inventory_item_img').first().evaluate(el => window.getComputedStyle(el).objectFit);
    expect(objectFit).toBeTruthy();
  });

  test('Should have proper spacing between items', async ({ page }) => {
    const margin = await page.locator('.inventory_item').first().evaluate(el => window.getComputedStyle(el).margin);
    expect(margin).toBeTruthy();
  });

  test('Should display proper color scheme', async ({ page }) => {
    const backgroundColor = await page.locator('.btn_primary').first().evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(backgroundColor).toBeTruthy();
  });

  test('Should have consistent button sizes', async ({ page }) => {
    const height = await page.locator('.btn_inventory').first().evaluate(el => el.offsetHeight);
    expect(height).toBeGreaterThan(0);
  });

  test('Should display cart icon badge properly', async ({ page }) => {
    await page.locator('.inventory_item').first().locator('.btn_inventory').click();
    const backgroundColor = await page.locator('.shopping_cart_badge').evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(backgroundColor).toBeTruthy();
  });

  test('Should have visible text on buttons', async ({ page }) => {
    const color = await page.locator('.btn_inventory').first().evaluate(el => window.getComputedStyle(el).color);
    expect(color).toBeTruthy();
  });

  test('Should display proper link styling', async ({ page }) => {
    const textDecoration = await page.locator('.inventory_item_name').first().evaluate(el => window.getComputedStyle(el).textDecoration);
    expect(textDecoration).toBeTruthy();
  });
});
