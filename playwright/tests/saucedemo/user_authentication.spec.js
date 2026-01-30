const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');

test.describe('User Authentication Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Should display login form', async ({ page }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Should display Swag Labs logo', async ({ page }) => {
    await expect(page.locator('.login_logo')).toBeVisible();
  });

  test('Should have empty username field initially', async ({ page }) => {
    await expect(loginPage.usernameInput).toHaveValue('');
  });

  test('Should have empty password field initially', async ({ page }) => {
    await expect(loginPage.passwordInput).toHaveValue('');
  });

  test('Should accept username input', async ({ page }) => {
    await loginPage.usernameInput.fill('test_user');
    await expect(loginPage.usernameInput).toHaveValue('test_user');
  });

  test('Should accept password input', async ({ page }) => {
    await loginPage.passwordInput.fill('test_password');
    await expect(loginPage.passwordInput).toHaveValue('test_password');
  });

  test('Should mask password input', async ({ page }) => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('Should login with standard user', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should show error with wrong password', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Should show error with wrong username', async ({ page }) => {
    await loginPage.login('wrong_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Should show error with empty username', async ({ page }) => {
    await loginPage.login('', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Should show error with empty password', async ({ page }) => {
    await loginPage.login('standard_user', '');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Should show error with both fields empty', async ({ page }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Should display error message for locked user', async ({ page }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('Should close error message', async ({ page }) => {
    await loginPage.login('wrong_user', 'wrong_pass');
    await page.locator('.error-button').click();
    await expect(loginPage.errorMessage).not.toBeVisible();
  });

  test('Should login with problem user', async ({ page }) => {
    await loginPage.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should login with performance glitch user', async ({ page }) => {
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should clear fields after error', async ({ page }) => {
    await loginPage.login('wrong', 'wrong');
    await page.locator('.error-button').click();
    await loginPage.usernameInput.clear();
    await expect(loginPage.usernameInput).toHaveValue('');
  });

  test('Should maintain login state after refresh', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.reload();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should logout successfully', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).not.toHaveURL(/.*inventory/);
  });

  test('Should not access inventory without login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).not.toHaveURL(/.*inventory/);
  });

  test('Should display accept all usernames text', async ({ page }) => {
    await expect(page.locator('.login_credentials')).toBeVisible();
  });

  test('Should display password text', async ({ page }) => {
    await expect(page.locator('.login_password')).toBeVisible();
  });
});
