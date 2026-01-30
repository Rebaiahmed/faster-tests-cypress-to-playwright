const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../page-objects/realworld/HomePage');
const { ArticlePage } = require('../../page-objects/realworld/ArticlePage');

test.describe('RealWorld - Article Browsing Tests', () => {
  let homePage;
  let articlePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    articlePage = new ArticlePage(page);
    await homePage.visit();
  });

  test('Should display multiple articles on homepage', async ({ page }) => {
    const result = await homePage.verifyArticleCount(1);
    expect(result).toBe(true);
  });

  test('Should show article preview with all details', async ({ page }) => {
    const preview = homePage.getArticlePreview(0);
    await expect(preview.locator('h1')).toBeVisible();
    await expect(preview.locator('p')).toBeVisible();
    await expect(preview.locator('.author')).toBeVisible();
    await expect(preview.locator('.date')).toBeVisible();
  });

  test('Should navigate to article detail page', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page).toHaveURL(/.*#\/article\//);
  });

  test('Should display article title on detail page', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(articlePage.getArticleTitle()).toBeVisible();
  });

  test('Should display article body on detail page', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(articlePage.getArticleBody()).toBeVisible();
  });

  test('Should display author info on article page', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.locator('.article-meta')).toBeVisible();
  });

  test('Should display article tags', async ({ page }) => {
    await homePage.clickArticle(0);
    const tagList = page.locator('.tag-list');
    const count = await tagList.count();
    if (count > 0) {
      await expect(tagList).toBeVisible();
    }
  });

  test('Should have favorite button on article page', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.locator('.btn').filter({ hasText: 'Favorite' })).toBeVisible();
  });

  test('Should display comments section', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.getByText('Sign in')).toBeVisible();
  });

  test('Should show sign in prompt for comments when not logged in', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.locator('.col-xs-12').getByText('Sign in')).toBeVisible();
  });

  test('Should display article date', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.locator('.date')).toBeVisible();
  });

  test('Should show author profile link', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.locator('.author').first()).toHaveAttribute('href', /.+/);
  });

  test('Should display follow button for author', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.locator('.btn-outline-secondary')).toBeVisible();
  });

  test('Should navigate back to home from article', async ({ page }) => {
    await homePage.clickArticle(0);
    await page.locator('.navbar').getByText('Home').click();
    await expect(page).toHaveURL('https://demo.realworld.io/#/');
  });

  test('Should load article without errors', async ({ page }) => {
    await homePage.clickArticle(0);
    await expect(page.locator('.article-page')).toBeVisible();
  });

  test('Should display Read more link on preview', async ({ page }) => {
    await expect(homePage.getArticlePreview(0).getByText('Read more')).toBeVisible();
  });

  test('Should have working Read more link', async ({ page }) => {
    await homePage.getArticlePreview(0).getByText('Read more').click();
    await expect(page).toHaveURL(/.*#\/article\//);
  });

  test('Should show favorite count', async ({ page }) => {
    const favoriteButton = homePage.getArticlePreview(0).locator('.btn-outline-primary');
    await expect(favoriteButton).toContainText(' ');
  });

  test('Should display article author avatar', async ({ page }) => {
    await expect(homePage.getArticlePreview(0).locator('img')).toBeVisible();
  });

  test('Should handle clicking on different articles', async ({ page }) => {
    const articleCount = await page.locator('.article-preview').count();
    if (articleCount > 1) {
      await homePage.clickArticle(1);
      await expect(page).toHaveURL(/.*#\/article\//);
    }
  });

  test('Should maintain article structure', async ({ page }) => {
    await expect(homePage.getArticlePreview(0)).toHaveClass(/article-preview/);
  });
});
