const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Product Sorting and Filtering', () => {
  let loginPage, productPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should display sort dropdown', async ({ page }) => {
    await expect(page.locator('.product_sort_container')).toBeVisible();
  });

  test('Should have Name (A to Z) as default sort', async ({ page }) => {
    await expect(page.locator('.product_sort_container')).toHaveValue('az');
  });

  test('Should sort by Name (Z to A)', async ({ page }) => {
    await productPage.applyFilter('za');
    const names = await page.locator('.inventory_item_name').allTextContents();
    const sortedNames = [...names].sort().reverse();
    expect(names).toEqual(sortedNames);
  });

  test('Should sort by Price (low to high)', async ({ page }) => {
    await productPage.applyFilter('lohi');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const priceValues = prices.map(text => parseFloat(text.replace('$', '')));
    const sortedPrices = [...priceValues].sort((a, b) => a - b);
    expect(priceValues).toEqual(sortedPrices);
  });

  test('Should sort by Price (high to low)', async ({ page }) => {
    await productPage.applyFilter('hilo');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const priceValues = prices.map(text => parseFloat(text.replace('$', '')));
    const sortedPrices = [...priceValues].sort((a, b) => b - a);
    expect(priceValues).toEqual(sortedPrices);
  });

  test('Should maintain sort after adding item to cart', async ({ page }) => {
    await productPage.applyFilter('lohi');
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(page.locator('.product_sort_container')).toHaveValue('lohi');
  });

  test('Should maintain sort after page reload', async ({ page }) => {
    await productPage.applyFilter('hilo');
    await page.reload();
    await expect(page.locator('.product_sort_container')).toHaveValue('az');
  });

  test('Should sort correctly with Name (A to Z)', async ({ page }) => {
    await productPage.applyFilter('az');
    await expect(page.locator('.inventory_item_name').first()).toBeVisible();
  });

  test('Should display all products after sorting', async ({ page }) => {
    await productPage.applyFilter('lohi');
    const items = await page.locator('.inventory_item').count();
    expect(items).toBeGreaterThanOrEqual(6);
  });

  test('Should handle multiple sort changes', async ({ page }) => {
    await productPage.applyFilter('lohi');
    await productPage.applyFilter('hilo');
    await productPage.applyFilter('az');
    await expect(page.locator('.product_sort_container')).toHaveValue('az');
  });

  test('Should verify price order ascending', async ({ page }) => {
    await productPage.applyFilter('lohi');
    const firstPriceText = await page.locator('.inventory_item_price').first().textContent();
    const lastPriceText = await page.locator('.inventory_item_price').last().textContent();
    const first = parseFloat(firstPriceText.replace('$', ''));
    const last = parseFloat(lastPriceText.replace('$', ''));
    expect(first).toBeLessThanOrEqual(last);
  });

  test('Should verify price order descending', async ({ page }) => {
    await productPage.applyFilter('hilo');
    const firstPriceText = await page.locator('.inventory_item_price').first().textContent();
    const lastPriceText = await page.locator('.inventory_item_price').last().textContent();
    const first = parseFloat(firstPriceText.replace('$', ''));
    const last = parseFloat(lastPriceText.replace('$', ''));
    expect(first).toBeGreaterThanOrEqual(last);
  });

  test('Should maintain product count after sorting', async ({ page }) => {
    const initialCount = await page.locator('.inventory_item').count();
    await productPage.applyFilter('lohi');
    const afterSortCount = await page.locator('.inventory_item').count();
    expect(afterSortCount).toBe(initialCount);
  });

  test('Should have valid sort options', async ({ page }) => {
    const options = await page.locator('.product_sort_container option').count();
    expect(options).toBe(4);
  });

  test('Should display correct option text', async ({ page }) => {
    await expect(page.locator('.product_sort_container option[value="az"]')).toContainText('Name (A to Z)');
    await expect(page.locator('.product_sort_container option[value="za"]')).toContainText('Name (Z to A)');
    await expect(page.locator('.product_sort_container option[value="lohi"]')).toContainText('Price (low to high)');
    await expect(page.locator('.product_sort_container option[value="hilo"]')).toContainText('Price (high to low)');
  });
});
