// Example: Migrated from cypress/e2e/login.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');

test.describe('SauceDemo - Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('should not login with invalid credentials', async ({ page }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should show error for locked out user', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });
});
