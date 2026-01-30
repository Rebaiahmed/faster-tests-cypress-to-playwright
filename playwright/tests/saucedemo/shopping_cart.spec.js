const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');
const { CartPage } = require('../../page-objects/CartPage');

test.describe('Shopping Cart Functionality', () => {
  let loginPage, productPage, cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('Should add an item to the cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(await productPage.getCartBadge()).toContainText('1');
    
    await productPage.openCart();
    await expect(await cartPage.getCartItems()).toHaveCount(1);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });

  test('Should remove an item from the cart', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-bike-light');
    await expect(await productPage.getCartBadge()).toContainText('1');
    
    await cartPage.removeItemById('sauce-labs-bike-light');
    await expect(await productPage.getCartBadge()).not.toBeVisible();
    
    await page.locator('.shopping_cart_link').click();
    await expect(await cartPage.getCartItems()).toHaveCount(0);
  });

  test('Should add a random product to the cart', async ({ page }) => {
    const items = await productPage.getInventoryItems();
    const count = await items.count();
    const randomIndex = Math.floor(Math.random() * count);
    await items.nth(randomIndex).locator('.btn_inventory').click();
    
    await productPage.openCart();
    await expect(await cartPage.getCartItems()).toHaveCount(1);
  });

  test('Should persist cart items across navigation', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await expect(await productPage.getCartBadge()).toContainText('1');
    
    await productPage.openCart();
    await expect(await cartPage.getCartItems()).toHaveCount(1);
    
    await page.goBack();
    await expect(await productPage.getCartBadge()).toContainText('1');
    
    await productPage.openCart();
    await expect(await cartPage.getCartItems()).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
  });

  test('Should persist cart items after page reload', async ({ page }) => {
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await expect(await productPage.getCartBadge()).toContainText('2');
    
    await page.reload();
    await expect(await productPage.getCartBadge()).toContainText('2');
    
    await productPage.openCart();
    await expect(await cartPage.getCartItems()).toHaveCount(2);
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
  });
});
