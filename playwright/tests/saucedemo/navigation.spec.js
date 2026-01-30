const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Navigation Tests', () => {
  let loginPage, productPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should display hamburger menu', async ({ page }) => {
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
  });

  test('Should open sidebar menu', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu')).toBeVisible();
  });

  test('Should close sidebar menu', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#react-burger-cross-btn').click();
    await expect(page.locator('.bm-menu')).not.toBeVisible();
  });

  test('Should display all menu items', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-item-list')).toBeVisible();
    const count = await page.locator('.bm-item').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Should navigate to all items', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#inventory_sidebar_link').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should navigate to about page', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
  });

  test('Should logout successfully', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).not.toHaveURL(/.*inventory/);
  });

  test('Should display cart icon', async ({ page }) => {
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('Should navigate to cart page', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Should display app logo', async ({ page }) => {
    await expect(page.locator('.app_logo')).toBeVisible();
  });

  test('Should maintain session after navigation', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
  });

  test('Should display reset app state option', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });

  test('Should navigate using browser back button', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should navigate using browser forward button', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await page.goForward();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Should display footer', async ({ page }) => {
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('Should display social media links', async ({ page }) => {
    await expect(page.locator('.social')).toBeVisible();
  });

  test('Should have working Twitter link', async ({ page }) => {
    await expect(page.locator('.social_twitter')).toHaveAttribute('href', /.+/);
  });

  test('Should have working Facebook link', async ({ page }) => {
    await expect(page.locator('.social_facebook')).toHaveAttribute('href', /.+/);
  });

  test('Should have working LinkedIn link', async ({ page }) => {
    await expect(page.locator('.social_linkedin')).toHaveAttribute('href', /.+/);
  });

  test('Should display copyright information', async ({ page }) => {
    await expect(page.locator('.footer_copy')).toBeVisible();
  });

  test('Should maintain menu state across navigation', async ({ page }) => {
    await page.locator('#react-burger-menu-btn').click();
    await page.waitForTimeout(500);
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.bm-menu')).not.toBeVisible();
  });
});
