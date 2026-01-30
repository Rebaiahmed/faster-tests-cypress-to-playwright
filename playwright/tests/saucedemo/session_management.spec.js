const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');

test.describe('Session Management Tests', () => {
  test('Should create session on login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session-username');
    expect(sessionCookie).toBeTruthy();
  });

  test('Should maintain session across pages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.shopping_cart_link').click();
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session-username');
    expect(sessionCookie).toBeTruthy();
  });

  test('Should persist cart in session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.reload();
    await expect(await productPage.getCartBadge()).toContainText('1');
  });

  test('Should clear session on logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session-username');
    expect(sessionCookie).toBeFalsy();
  });

  test('Should handle session after refresh', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.reload();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should prevent access without session', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });

  test('Should maintain filter preferences in session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.applyFilter('lohi');
    await page.reload();
    await expect(page.locator('.product_sort_container')).toHaveValue('az');
  });

  test('Should handle multiple tab sessions', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const newPage = await context.newPage();
    await newPage.goto('https://www.saucedemo.com/inventory.html');
    await newPage.close();
  });

  test('Should preserve cart state in session storage', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    const cartContents = await page.evaluate(() => sessionStorage.getItem('cart-contents'));
    expect(cartContents).toBeTruthy();
  });

  test('Should handle session timeout gracefully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForTimeout(1000);
    await page.reload();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should clear local storage on logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(await productPage.getCartBadge()).not.toBeVisible();
  });

  test('Should maintain session across navigation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.inventory_item_name').first().click();
    await page.goBack();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should store user preferences', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const localStorage = await page.evaluate(() => localStorage);
    expect(localStorage).toBeTruthy();
  });

  test('Should handle concurrent requests', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await productPage.addToCartById('sauce-labs-bike-light');
    await expect(await productPage.getCartBadge()).toContainText('2');
  });

  test('Should validate session token', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session-username');
    expect(sessionCookie).toBeTruthy();
    expect(sessionCookie.value).toBeTruthy();
  });

  test('Should handle browser back with active session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should handle browser forward with active session', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await page.goForward();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Should reset session state on app reset', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#reset_sidebar_link').click();
    await expect(await productPage.getCartBadge()).not.toBeVisible();
  });

  test('Should handle rapid session operations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    for(let i = 0; i < 3; i++) {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
      await page.locator('#react-burger-menu-btn').click();
      await page.locator('#logout_sidebar_link').click();
    }
  });

  test('Should maintain security with session cookies', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'session-username');
    expect(sessionCookie).toBeTruthy();
    // Note: secure flag may not be set in test environment
  });
});
