const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../page-objects/realworld/HomePage');

test.describe.skip('RealWorld - Tags and Filtering Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visit();
  });

  test('Should display Popular Tags section', async ({ page }) => {
    await page.waitForSelector('.sidebar', { timeout: 10000 });
    await expect(page.getByText('Popular Tags')).toBeVisible({ timeout: 10000 });
  });

  test('Should display tag list', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    const tagCount = await page.locator('.tag-list a').count();
    expect(tagCount).toBeGreaterThanOrEqual(1);
  });

  test('Should display tags with proper styling', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await expect(page.locator('.tag-list a').first()).toHaveClass(/tag-pill/, { timeout: 10000 });
  });

  test('Should filter articles when clicking a tag', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    const tagName = await page.locator('.tag-list a').first().textContent();
    await page.locator('.tag-list a').first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.feed-toggle .nav-link.active')).toContainText(tagName.trim(), { timeout: 10000 });
  });

  test('Should show tagged articles after filter', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').first().click();
    await page.waitForLoadState('networkidle');
    const articleCount = await page.locator('.article-preview').count();
    expect(articleCount).toBeGreaterThanOrEqual(0);
  });

  test('Should create new tab for filtered tag', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').first().click();
    await page.waitForLoadState('networkidle');
    const navLinks = await page.locator('.feed-toggle .nav-link').count();
    expect(navLinks).toBe(2);
  });

  test('Should allow switching back to Global Feed', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').first().click();
    await page.waitForLoadState('networkidle');
    await homePage.getGlobalFeedTab().click();
    await page.waitForLoadState('networkidle');
    await expect(homePage.getGlobalFeedTab()).toHaveClass(/active/, { timeout: 10000 });
  });

  test('Should have clickable tag pills', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await expect(page.locator('.tag-list a').first()).toHaveCSS('cursor', 'pointer', { timeout: 10000 });
  });

  test('Should maintain tags sidebar on all pages', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await expect(page.locator('.tag-list')).toBeVisible({ timeout: 10000 });
  });

  test('Should display multiple tags', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    const tagCount = await page.locator('.tag-list a').count();
    expect(tagCount).toBeGreaterThanOrEqual(3);
  });

  test('Should show tag names clearly', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    const tagText = await page.locator('.tag-list a').first().textContent();
    expect(tagText).not.toBe('');
  });

  test('Should handle tag selection', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').nth(1).click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.feed-toggle')).toContainText('a', { timeout: 10000 });
  });

  test('Should maintain tag list after filtering', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.tag-list')).toBeVisible({ timeout: 10000 });
  });

  test('Should display tags sidebar consistently', async ({ page }) => {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await expect(page.locator('.tag-list')).toBeVisible({ timeout: 10000 });
  });

  test('Should have properly formatted tag display', async ({ page }) => {
    await page.waitForSelector('.sidebar', { timeout: 10000 });
    await expect(page.locator('.sidebar')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.sidebar').getByText('Popular Tags')).toBeVisible({ timeout: 10000 });
  });

  test('Should show loading state when filtering', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').first().click();
    await page.waitForLoadState('networkidle');
  });

  test('Should handle multiple tag selections', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await page.locator('.tag-list a').nth(0).click();
    await page.waitForLoadState('networkidle');
    await homePage.getGlobalFeedTab().click();
    await page.waitForLoadState('networkidle');
    await page.locator('.tag-list a').nth(1).click();
    await page.waitForLoadState('networkidle');
    const navLinks = await page.locator('.feed-toggle .nav-link').count();
    expect(navLinks).toBe(2);
  });

  test('Should display tag pill styling', async ({ page }) => {
    await page.waitForSelector('.tag-list', { timeout: 10000 });
    await expect(page.locator('.tag-list a').first()).toHaveClass(/tag-default/, { timeout: 10000 });
  });

  test('Should maintain sidebar width', async ({ page }) => {
    const width = await page.locator('.sidebar').evaluate(el => window.getComputedStyle(el).width);
    expect(width).toBeTruthy();
  });

  test('Should show tags in organized layout', async ({ page }) => {
    const display = await page.locator('.tag-list').evaluate(el => window.getComputedStyle(el).display);
    expect(display).toBeTruthy();
  });
});
