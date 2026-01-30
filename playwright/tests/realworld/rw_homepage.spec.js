const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../page-objects/realworld/HomePage');

test.describe('RealWorld - Homepage Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visit();
  });

  test('Should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*demo\.realworld\.io/);
  });

  test('Should display conduit banner', async ({ page }) => {
    await expect(page.locator('.banner')).toBeVisible();
    await expect(page.getByText('conduit')).toBeVisible();
  });

  test('Should display tagline', async ({ page }) => {
    await expect(page.getByText('A place to share your knowledge')).toBeVisible();
  });

  test('Should display Global Feed tab', async ({ page }) => {
    await expect(homePage.getGlobalFeedTab()).toBeVisible();
  });

  test('Should have Global Feed as default active tab', async ({ page }) => {
    await expect(homePage.getGlobalFeedTab()).toHaveClass(/active/);
  });

  test('Should display article previews', async ({ page }) => {
    const articleCount = await page.locator('.article-preview').count();
    expect(articleCount).toBeGreaterThanOrEqual(1);
  });

  test('Should display article titles', async ({ page }) => {
    await expect(page.locator('.article-preview h1').first()).toBeVisible();
  });

  test('Should display article descriptions', async ({ page }) => {
    await expect(page.locator('.article-preview p').first()).toBeVisible();
  });

  test('Should display article authors', async ({ page }) => {
    await expect(page.locator('.article-preview .author').first()).toBeVisible();
  });

  test('Should display article dates', async ({ page }) => {
    await expect(page.locator('.article-preview .date').first()).toBeVisible();
  });

  test('Should display favorite counts', async ({ page }) => {
    await expect(page.locator('.article-preview .btn-outline-primary').first()).toBeVisible();
  });

  test('Should display popular tags sidebar', async ({ page }) => {
    await expect(page.getByText('Popular Tags')).toBeVisible();
  });

  test('Should display tags in sidebar', async ({ page }) => {
    const tagCount = await page.locator('.tag-list a').count();
    expect(tagCount).toBeGreaterThanOrEqual(1);
  });

  test('Should make article title clickable', async ({ page }) => {
    const title = page.locator('.article-preview h1').first();
    await expect(title).toHaveCSS('cursor', 'pointer');
  });

  test('Should display Read more link', async ({ page }) => {
    await expect(page.locator('.article-preview').first().getByText('Read more')).toBeVisible();
  });

  test('Should navigate to article on title click', async ({ page }) => {
    await page.locator('.article-preview h1').first().click();
    await expect(page).toHaveURL(/.*#\/article\//);
  });

  test('Should display pagination if many articles', async ({ page }) => {
    const pagination = page.locator('.pagination');
    const count = await pagination.count();
    if (count > 0) {
      await expect(pagination).toBeVisible();
    }
  });

  test('Should filter articles by tag', async ({ page }) => {
    await page.locator('.tag-list a').first().click();
    await expect(page.locator('.feed-toggle')).toContainText('a');
  });

  test('Should display navbar', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
  });

  test('Should display Home link in navbar', async ({ page }) => {
    await expect(page.locator('.navbar').getByText('Home')).toBeVisible();
  });

  test('Should display Sign in link when not authenticated', async ({ page }) => {
    await expect(page.locator('.navbar').getByText('Sign in')).toBeVisible();
  });

  test('Should display Sign up link when not authenticated', async ({ page }) => {
    await expect(page.locator('.navbar').getByText('Sign up')).toBeVisible();
  });

  test('Should have working Home navigation', async ({ page }) => {
    await page.locator('.navbar').getByText('Home').click();
    await expect(page).toHaveURL('https://demo.realworld.io/#/');
  });

  test('Should display footer', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});
