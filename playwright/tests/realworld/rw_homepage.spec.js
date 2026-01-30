const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../page-objects/realworld/HomePage');

test.describe.skip('RealWorld - Homepage Tests', () => {
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
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    const articleCount = await page.locator('.article-preview').count();
    expect(articleCount).toBeGreaterThanOrEqual(1);
  });

  test('Should display article titles', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    await expect(page.locator('.article-preview h1, .article-preview .preview-link').first()).toBeVisible({ timeout: 10000 });
  });

  test('Should display article descriptions', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    await expect(page.locator('.article-preview p').first()).toBeVisible({ timeout: 10000 });
  });

  test('Should display article authors', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    await expect(page.locator('.article-preview .author').first()).toBeVisible({ timeout: 10000 });
  });

  test('Should display article dates', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    await expect(page.locator('.article-preview .date').first()).toBeVisible({ timeout: 10000 });
  });

  test('Should display favorite counts', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    await expect(page.locator('.article-preview .btn-outline-primary').first()).toBeVisible({ timeout: 10000 });
  });

  test('Should display popular tags sidebar', async ({ page }) => {
    await expect(page.getByText('Popular Tags')).toBeVisible();
  });

  test('Should display tags in sidebar', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    const tagCount = await page.locator('.tag-list a').count();
    expect(tagCount).toBeGreaterThanOrEqual(1);
  });

  test('Should make article title clickable', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    const title = page.locator('.article-preview h1, .article-preview .preview-link').first();
    await expect(title).toHaveCSS('cursor', 'pointer', { timeout: 10000 });
  });

  test('Should display Read more link', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    await expect(page.locator('.article-preview').first().getByText('Read more')).toBeVisible({ timeout: 10000 });
  });

  test('Should navigate to article on title click', async ({ page }) => {
    await page.waitForSelector('.article-preview', { timeout: 10000 });
    await page.locator('.article-preview h1, .article-preview .preview-link').first().click();
    await page.waitForLoadState('networkidle');
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
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.feed-toggle')).toContainText('a', { timeout: 10000 });
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
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('https://demo.realworld.io/#/');
  });

  test('Should display footer', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});
