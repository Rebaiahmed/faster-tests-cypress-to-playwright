const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../page-objects/realworld/HomePage');
const { AuthPage } = require('../../page-objects/realworld/AuthPage');

test.describe('RealWorld - Navigation Tests', () => {
  let homePage;
  let authPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    authPage = new AuthPage(page);
    await homePage.visit();
  });

  test('Should display main navigation bar', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('Should display conduit logo', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toContainText('conduit');
  });

  test('Should navigate to home via logo', async ({ page }) => {
    await authPage.visitLogin();
    await page.locator('.navbar-brand').click();
    await expect(page).toHaveURL('https://demo.realworld.io/#/');
  });

  test('Should navigate to home via Home link', async ({ page }) => {
    await authPage.visitLogin();
    await page.locator('.navbar').getByText('Home').click();
    await expect(page).toHaveURL('https://demo.realworld.io/#/');
  });

  test('Should navigate to sign in page', async ({ page }) => {
    await page.locator('.navbar').getByText('Sign in').click();
    await expect(page).toHaveURL(/.*#\/login/);
  });

  test('Should navigate to sign up page', async ({ page }) => {
    await page.locator('.navbar').getByText('Sign up').click();
    await expect(page).toHaveURL(/.*#\/register/);
  });

  test('Should have correct navigation items when logged out', async ({ page }) => {
    const navLinks = await page.locator('.navbar .nav-link').count();
    expect(navLinks).toBeGreaterThanOrEqual(3);
  });

  test('Should highlight active navigation item', async ({ page }) => {
    await expect(page.locator('.navbar').getByText('Home')).toHaveClass(/active/);
  });

  test('Should maintain navigation across pages', async ({ page }) => {
    await authPage.visitLogin();
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.navbar').getByText('Home')).toBeVisible();
  });

  test('Should have responsive navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('Should display footer on all pages', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await authPage.visitLogin();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Should navigate using browser back button', async ({ page }) => {
    await authPage.visitLogin();
    await page.goBack();
    await expect(page).toHaveURL('https://demo.realworld.io/#/');
  });

  test('Should navigate using browser forward button', async ({ page }) => {
    await authPage.visitLogin();
    await page.goBack();
    await page.goForward();
    await expect(page).toHaveURL(/.*#\/login/);
  });

  test('Should have working links in navigation', async ({ page }) => {
    const links = page.locator('.navbar a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('href', /.+/);
    }
  });

  test('Should display navigation consistently', async ({ page }) => {
    await page.reload();
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('Should handle multiple navigation clicks', async ({ page }) => {
    await page.locator('.navbar').getByText('Sign in').click();
    await page.locator('.navbar').getByText('Home').click();
    await page.locator('.navbar').getByText('Sign up').click();
    await expect(page).toHaveURL(/.*#\/register/);
  });

  test('Should maintain URL structure', async ({ page }) => {
    await expect(page).toHaveURL(/^https:\/\/demo\.realworld\.io\/#\//);
  });

  test('Should have accessible navigation links', async ({ page }) => {
    const links = page.locator('.navbar a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toBeVisible();
    }
  });

  test('Should preserve navigation state on refresh', async ({ page }) => {
    await authPage.visitLogin();
    await page.reload();
    await expect(page).toHaveURL(/.*#\/login/);
  });

  test('Should handle rapid navigation changes', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.locator('.navbar').getByText('Sign in').click();
      await page.locator('.navbar').getByText('Home').click();
    }
    await expect(page).toHaveURL('https://demo.realworld.io/#/');
  });
});
