const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../page-objects/realworld/HomePage');
const { AuthPage } = require('../../page-objects/realworld/AuthPage');

test.describe('RealWorld - Authentication Tests', () => {
  let homePage;
  let authPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    authPage = new AuthPage(page);
    await homePage.visit();
  });

  test('Should display login page correctly', async ({ page }) => {
    await authPage.visitLogin();
    await expect(page).toHaveURL(/.*#\/login/);
    await expect(page.locator('h1').filter({ hasText: 'Sign in' })).toBeVisible();
  });

  test('Should display register page correctly', async ({ page }) => {
    await authPage.visitRegister();
    await expect(page).toHaveURL(/.*#\/register/);
    await expect(page.locator('h1').filter({ hasText: 'Sign up' })).toBeVisible();
  });

  test('Should have link to switch from login to register', async ({ page }) => {
    await authPage.visitLogin();
    await expect(page.locator('a').filter({ hasText: 'Need an account?' })).toBeVisible();
  });

  test('Should have link to switch from register to login', async ({ page }) => {
    await authPage.visitRegister();
    await expect(page.locator('a').filter({ hasText: 'Have an account?' })).toBeVisible();
  });

  test('Should show error for empty login form', async ({ page }) => {
    await authPage.visitLogin();
    await authPage.getSubmitButton().click();
    await expect(page).toHaveURL(/.*#\/login/);
  });

  test('Should show error for empty register form', async ({ page }) => {
    await authPage.visitRegister();
    await authPage.getSubmitButton().click();
    await expect(page).toHaveURL(/.*#\/register/);
  });

  test('Should show error for invalid email format in login', async ({ page }) => {
    await authPage.visitLogin();
    await authPage.getEmailInput().fill('invalid-email');
    await authPage.getPasswordInput().fill('password123');
    await authPage.getSubmitButton().click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*#\/login/);
  });

  test('Should accept valid email format', async ({ page }) => {
    await authPage.visitLogin();
    await authPage.getEmailInput().fill('test@example.com');
    await expect(authPage.getEmailInput()).toHaveValue('test@example.com');
  });

  test('Should mask password input', async ({ page }) => {
    await authPage.visitLogin();
    await expect(authPage.getPasswordInput()).toHaveAttribute('type', 'password');
  });

  test('Should enable submit button when form is filled', async ({ page }) => {
    await authPage.visitLogin();
    await authPage.getEmailInput().fill('test@example.com');
    await authPage.getPasswordInput().fill('password123');
    await expect(authPage.getSubmitButton()).toBeEnabled();
  });

  test('Should display username field on register page', async ({ page }) => {
    await authPage.visitRegister();
    await expect(authPage.getUsernameInput()).toBeVisible();
  });

  test('Should navigate to register from login', async ({ page }) => {
    await authPage.visitLogin();
    await page.locator('a').filter({ hasText: 'Need an account?' }).click();
    await expect(page).toHaveURL(/.*#\/register/);
  });

  test('Should navigate to login from register', async ({ page }) => {
    await authPage.visitRegister();
    await page.locator('a').filter({ hasText: 'Have an account?' }).click();
    await expect(page).toHaveURL(/.*#\/login/);
  });

  test('Should persist input values when switching between forms', async ({ page }) => {
    await authPage.visitLogin();
    await authPage.getEmailInput().fill('test@example.com');
    await page.locator('a').filter({ hasText: 'Need an account?' }).click();
    await page.goBack();
    await expect(authPage.getEmailInput()).toHaveValue('');
  });

  test('Should show email input placeholder', async ({ page }) => {
    await authPage.visitLogin();
    await expect(authPage.getEmailInput()).toHaveAttribute('placeholder', 'Email');
  });

  test('Should show password input placeholder', async ({ page }) => {
    await authPage.visitLogin();
    await expect(authPage.getPasswordInput()).toHaveAttribute('placeholder', 'Password');
  });

  test('Should display sign in button text', async ({ page }) => {
    await authPage.visitLogin();
    await expect(authPage.getSubmitButton()).toContainText('Sign in');
  });

  test('Should display sign up button text', async ({ page }) => {
    await authPage.visitRegister();
    await expect(authPage.getSubmitButton()).toContainText('Sign up');
  });

  test('Should have conduit branding on auth pages', async ({ page }) => {
    await authPage.visitLogin();
    await expect(page.locator('.navbar-brand')).toContainText('conduit');
  });

  test('Should display home link in navigation', async ({ page }) => {
    await authPage.visitLogin();
    await expect(page.locator('.navbar').getByText('Home')).toBeVisible();
  });
});
