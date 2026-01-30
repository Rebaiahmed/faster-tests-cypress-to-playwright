const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');
const { CartPage } = require('../../page-objects/CartPage');

test.describe('Advanced Cart Operations', () => {
  let loginPage, productPage, cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should add multiple items to cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await productPage.addToCartById('sauce-labs-bolt-t-shirt');
    await expect(page.locator('.shopping_cart_badge')).toContainText('3');
  });

  test('Should display correct cart count', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
  });

  test('Should update cart count when adding items', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
    await productPage.addToCartById('sauce-labs-bike-light');
    await expect(page.locator('.shopping_cart_badge')).toContainText('2');
  });

  test('Should update cart count when removing items', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await expect(page.locator('.shopping_cart_badge')).toContainText('2');
    await cartPage.removeItemById('sauce-labs-backpack');
    await expect(page.locator('.shopping_cart_badge')).toContainText('1');
  });

  test('Should remove cart badge when cart is empty', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await cartPage.removeItemById('sauce-labs-backpack');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('Should display empty cart message when no items', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('Should display continue shopping button', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.btn_secondary')).toBeVisible();
  });

  test('Should return to products from cart', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await page.locator('.btn_secondary').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should display checkout button when cart has items', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.checkout_button')).toBeVisible();
  });

  test('Should display item quantity in cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_quantity')).toBeVisible();
  });

  test('Should display item name in cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
  });

  test('Should display item description in cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.inventory_item_desc')).toBeVisible();
  });

  test('Should display item price in cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.inventory_item_price')).toBeVisible();
  });

  test('Should add all products to cart', async ({ page }) => {
    const buttons = await page.locator('.btn_inventory').all();
    for (const btn of buttons) {
      await btn.click();
    }
    const badgeText = await page.locator('.shopping_cart_badge').textContent();
    expect(parseFloat(badgeText)).toBeGreaterThanOrEqual(6);
  });

  test('Should remove all products from cart', async ({ page }) => {
    const buttons = await page.locator('.btn_inventory').all();
    for (const btn of buttons) {
      await btn.click();
    }
    const removeButtons = await page.locator('.btn_inventory').all();
    for (const btn of removeButtons) {
      await btn.click();
    }
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('Should maintain item order in cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item').first()).toContainText('Sauce Labs Backpack');
  });

  test('Should allow removing items from cart page', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
    await page.locator('.cart_button').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('Should display remove button for each cart item', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_button')).toHaveCount(2);
  });

  test('Should handle rapid add/remove operations', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await productPage.addToCartById('sauce-labs-backpack');
      await cartPage.removeItemById('sauce-labs-backpack');
    }
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('Should persist cart after logout and login', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
