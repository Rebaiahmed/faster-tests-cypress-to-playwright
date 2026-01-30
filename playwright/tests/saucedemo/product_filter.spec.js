const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('SauceDemo - Product Filter Tests', () => {
  let loginPage, productPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should have "Name (A to Z)" as the default filter', async ({ page }) => {
    await expect(page.locator('.product_sort_container')).toHaveValue('az');
  });

  test('Should filter products by "Price (low to high)"', async ({ page }) => {
    await productPage.applyFilter('lohi');
    
    const priceElements = await page.locator('.inventory_item_price').all();
    const prices = await Promise.all(
      priceElements.map(async (el) => {
        const text = await el.textContent();
        return parseFloat(text.replace('$', ''));
      })
    );
    
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('Should filter products by "Price (high to low)"', async ({ page }) => {
    await productPage.applyFilter('hilo');
    
    const priceElements = await page.locator('.inventory_item_price').all();
    const prices = await Promise.all(
      priceElements.map(async (el) => {
        const text = await el.textContent();
        return parseFloat(text.replace('$', ''));
      })
    );
    
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });
});
