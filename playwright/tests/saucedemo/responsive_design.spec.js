const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { width: 1920, height: 1080, name: 'Desktop HD' },
    { width: 1366, height: 768, name: 'Laptop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' }
  ];

  viewports.forEach((viewport) => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      let loginPage, productPage;

      test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await loginPage.goto();
        await loginPage.login('standard_user', 'secret_sauce');
      });

      test('Should display inventory items', async ({ page }) => {
        await expect(page.locator('.inventory_item').first()).toBeVisible();
      });

      test('Should display cart icon', async ({ page }) => {
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
      });

      test('Should display menu button', async ({ page }) => {
        await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
      });

      test('Should be able to add items to cart', async ({ page }) => {
        await page.locator('.btn_inventory').first().click();
        await expect(await productPage.getCartBadge()).toContainText('1');
      });

      test('Should navigate to cart', async ({ page }) => {
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(/.*cart\.html/);
      });
    });
  });

  test('Should adapt layout on window resize', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.inventory_item').first()).toBeVisible();
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });

  test('Should maintain functionality on portrait orientation', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(await productPage.getCartBadge()).toContainText('1');
  });

  test('Should maintain functionality on landscape orientation', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(await productPage.getCartBadge()).toContainText('1');
  });

  test('Should display footer on all screen sizes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    for (const width of [375, 768, 1366, 1920]) {
      await page.setViewportSize({ width, height: 1080 });
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page.locator('.footer')).toHaveCount(1);
    }
  });

  test('Should handle mobile menu interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu')).toBeVisible();
  });
});
