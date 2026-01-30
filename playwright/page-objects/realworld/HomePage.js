class HomePage {
  constructor(page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto('https://demo.realworld.io/#/', { waitUntil: 'networkidle' });
    // Wait for articles to load
    await this.page.waitForSelector('.article-preview', { timeout: 10000 }).catch(() => {});
  }

  getGlobalFeedTab() {
    return this.page.locator('.nav-link').filter({ hasText: 'Global Feed' });
  }

  getYourFeedTab() {
    return this.page.locator('.nav-link').filter({ hasText: 'Your Feed' });
  }

  getArticlePreview(index = 0) {
    return this.page.locator('.article-preview').nth(index);
  }

  async clickArticle(index = 0) {
    // Click on the article title link (which is actually an anchor, not h1)
    const preview = this.getArticlePreview(index);
    await preview.waitFor({ state: 'visible', timeout: 10000 });
    const titleLink = preview.locator('a.preview-link, h1 a, .article-preview h1').first();
    await titleLink.click({ timeout: 10000 });
    await this.page.waitForLoadState('networkidle');
  }

  getPopularTags() {
    return this.page.locator('.sidebar .tag-list a');
  }

  async clickTag(tagName) {
    await this.page.locator('.sidebar .tag-list').locator('a', { hasText: tagName }).click();
  }

  async favoriteArticle(index = 0) {
    await this.getArticlePreview(index).locator('.btn-outline-primary').first().click();
  }

  async verifyArticleCount(minCount = 1) {
    await this.page.waitForSelector('.article-preview', { timeout: 10000 });
    const count = await this.page.locator('.article-preview').count();
    return count >= minCount;
  }
}

module.exports = { HomePage };
