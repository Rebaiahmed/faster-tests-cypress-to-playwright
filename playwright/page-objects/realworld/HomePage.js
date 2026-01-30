class HomePage {
  constructor(page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto('https://demo.realworld.io/#/');
  }

  getGlobalFeedTab() {
    return this.page.getByRole('link', { name: 'Global Feed' });
  }

  getYourFeedTab() {
    return this.page.getByRole('link', { name: 'Your Feed' });
  }

  getArticlePreview(index = 0) {
    return this.page.locator('.article-preview').nth(index);
  }

  async clickArticle(index = 0) {
    await this.getArticlePreview(index).locator('h1').click();
  }

  getPopularTags() {
    return this.page.locator('.tag-list a');
  }

  async clickTag(tagName) {
    await this.page.locator('.tag-list').getByText(tagName).click();
  }

  async favoriteArticle(index = 0) {
    await this.getArticlePreview(index).locator('.btn-outline-primary').click();
  }

  async verifyArticleCount(minCount = 1) {
    const count = await this.page.locator('.article-preview').count();
    return count >= minCount;
  }
}

module.exports = { HomePage };
