const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Performance Tests', () => {
  let loginPage, productPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    await loginPage.goto();
  });

  test('Should load login page within acceptable time', async ({ page }) => {
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    expect(loadTime).toBeLessThan(5000);
  });

  test('Should login within reasonable time', async ({ page }) => {
    const start = Date.now();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });

  test('Should load inventory page quickly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    expect(loadTime).toBeLessThan(5000);
  });

  test('Should add items to cart quickly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const start = Date.now();
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(await productPage.getCartBadge()).toContainText('1');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  test('Should load cart page quickly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    const start = Date.now();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  test('Should handle rapid clicks efficiently', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    for(let i = 0; i < 10; i++) {
      await page.locator('.btn_inventory').first().click();
    }
    await expect(await productPage.getCartBadge()).toHaveCount(1);
  });

  test('Should filter products quickly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const start = Date.now();
    await productPage.applyFilter('lohi');
    await expect(page.locator('.product_sort_container')).toHaveValue('lohi');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000);
  });

  test('Should navigate between pages smoothly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.btn_secondary').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should handle multiple products loading', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const count = await page.locator('.inventory_item').count();
    expect(count).toBeGreaterThanOrEqual(6);
    const images = page.locator('.inventory_item img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toBeVisible();
    }
  });

  test('Should load product details quickly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const start = Date.now();
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  test('Should handle performance_glitch_user', async ({ page }) => {
    const start = Date.now();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
    const duration = Date.now() - start;
    console.log(`Performance glitch user login took: ${duration}ms`);
  });

  test('Should load images efficiently', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const images = page.locator('.inventory_item img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toBeVisible();
      const naturalWidth = await images.nth(i).evaluate(img => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('Should maintain performance with full cart', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const buttons = page.locator('.btn_inventory');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }
    await page.locator('.shopping_cart_link').click();
    const cartItems = await page.locator('.cart_item').count();
    expect(cartItems).toBeGreaterThanOrEqual(6);
  });

  test('Should checkout quickly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    const start = Date.now();
    await page.locator('.checkout_button').click();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  test('Should handle menu animations smoothly', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu')).toBeVisible();
    await page.locator('#react-burger-cross-btn').click();
  });

  test('Should sort products efficiently', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    const start = Date.now();
    await productPage.applyFilter('hilo');
    await productPage.applyFilter('lohi');
    await productPage.applyFilter('az');
    await productPage.applyFilter('za');
    await expect(page.locator('.product_sort_container')).toHaveValue('za');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });
});
