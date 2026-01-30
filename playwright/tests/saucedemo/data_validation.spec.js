const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Data Validation Tests', () => {
  let loginPage, productPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should validate product names are not empty', async ({ page }) => {
    const names = page.locator('.inventory_item_name');
    const count = await names.count();
    for (let i = 0; i < count; i++) {
      const text = await names.nth(i).textContent();
      expect(text.trim()).not.toBe('');
    }
  });

  test('Should validate product prices are numeric', async ({ page }) => {
    const prices = page.locator('.inventory_item_price');
    const count = await prices.count();
    for (let i = 0; i < count; i++) {
      const text = await prices.nth(i).textContent();
      const price = parseFloat(text.replace('$', ''));
      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThan(0);
    }
  });

  test('Should validate all product images have valid sources', async ({ page }) => {
    const images = page.locator('.inventory_item img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toBe('');
    }
  });

  test('Should validate cart badge displays only numbers', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    const badgeText = await (await productPage.getCartBadge()).textContent();
    expect(badgeText).toMatch(/^\d+$/);
  });

  test('Should validate product descriptions are meaningful', async ({ page }) => {
    const descriptions = page.locator('.inventory_item_desc');
    const count = await descriptions.count();
    for (let i = 0; i < count; i++) {
      const text = await descriptions.nth(i).textContent();
      expect(text.length).toBeGreaterThan(10);
    }
  });

  test('Should validate URLs are properly formatted', async ({ page }) => {
    const url = page.url();
    expect(url).toMatch(/^https?:\/\/.+/);
  });

  test('Should validate footer links have href attributes', async ({ page }) => {
    const links = page.locator('.social a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('');
    }
  });

  test('Should validate product IDs are consistent', async ({ page }) => {
    const elements = page.locator('[data-test]');
    const count = await elements.count();
    for (let i = 0; i < count; i++) {
      const dataTest = await elements.nth(i).getAttribute('data-test');
      expect(dataTest).toBeTruthy();
      expect(dataTest).not.toBe('');
    }
  });

  test('Should validate button states change appropriately', async ({ page }) => {
    const button = page.locator('.btn_inventory').first();
    await expect(button).toContainText('Add to cart');
    await button.click();
    await expect(button).toContainText('Remove');
  });

  test('Should validate form inputs accept text', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.checkout_button').click();
    await page.locator('[data-test="firstName"]').fill('TestData123');
    const value = await page.locator('[data-test="firstName"]').inputValue();
    expect(value).toBe('TestData123');
  });

  test('Should validate total price calculation is accurate', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.checkout_button').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const totalText = await page.locator('.summary_total_label').textContent();
    const subtotalValue = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const taxValue = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const totalValue = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    expect(totalValue).toBeCloseTo(subtotalValue + taxValue, 2);
  });
});
