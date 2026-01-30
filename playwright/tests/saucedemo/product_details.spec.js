const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Product Details Tests', () => {
  let loginPage, productPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should display product image correctly', async ({ page }) => {
    const firstItem = await productPage.getInventoryItems().first();
    await expect(firstItem.locator('img')).toBeVisible();
    await expect(firstItem.locator('img')).toHaveAttribute('src', /.+/);
  });

  test('Should display product name', async ({ page }) => {
    const firstName = page.locator('.inventory_item_name').first();
    await expect(firstName).toBeVisible();
    const text = await firstName.textContent();
    expect(text).toBeTruthy();
  });

  test('Should display product description', async ({ page }) => {
    const firstDesc = page.locator('.inventory_item_desc').first();
    await expect(firstDesc).toBeVisible();
    const text = await firstDesc.textContent();
    expect(text).toBeTruthy();
  });

  test('Should display product price', async ({ page }) => {
    const firstPrice = page.locator('.inventory_item_price').first();
    await expect(firstPrice).toBeVisible();
    await expect(firstPrice).toContainText('$');
  });

  test('Should navigate to product detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);
  });

  test('Should display back to products button on detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('.back-to-products')).toBeVisible();
  });

  test('Should return to products page from detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await page.locator('.back-to-products').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should add product from detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await page.locator('.btn_inventory').click();
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
  });

  test('Should remove product from detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await page.locator('.btn_inventory').click();
    await page.locator('.btn_inventory').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('Should display all product information on detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
  });

  test('Should display correct product count', async ({ page }) => {
    const count = await productPage.getInventoryItems().count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Should have valid product links', async ({ page }) => {
    const links = await page.locator('.inventory_item_name').all();
    for (const link of links) {
      await expect(link).toHaveAttribute('href', /.+/);
    }
  });

  test('Should display product images with alt text', async ({ page }) => {
    await expect(page.locator('.inventory_item img').first()).toHaveAttribute('alt', /.+/);
  });

  test('Should maintain cart state when viewing product details', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
    await page.locator('.inventory_item_name').nth(1).click();
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
  });

  test('Should display add to cart button on each product', async ({ page }) => {
    const items = await productPage.getInventoryItems().all();
    for (const item of items) {
      await expect(item.locator('.btn_inventory')).toBeVisible();
    }
  });

  test('Should change button text after adding to cart', async ({ page }) => {
    const firstItem = await productPage.getInventoryItems().first();
    await firstItem.locator('.btn_inventory').click();
    await expect(firstItem.locator('.btn_inventory')).toContainText('Remove');
  });

  test('Should display product price in correct format', async ({ page }) => {
    const priceText = await page.locator('.inventory_item_price').first().textContent();
    expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('Should allow navigation between multiple products', async ({ page }) => {
    await page.locator('.inventory_item_name').nth(0).click();
    await page.locator('.back-to-products').click();
    await page.locator('.inventory_item_name').nth(1).click();
    await expect(page).toHaveURL(/.*inventory-item\.html/);
  });

  test('Should display consistent product data', async ({ page }) => {
    const productName = await page.locator('.inventory_item_name').first().textContent();
    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('.inventory_details_name')).toContainText(productName);
  });

  test('Should handle product image loading', async ({ page }) => {
    const img = page.locator('.inventory_item img').first();
    await expect(img).toBeVisible();
    const width = await img.evaluate((el) => el.naturalWidth);
    expect(width).toBeGreaterThan(0);
  });
});
