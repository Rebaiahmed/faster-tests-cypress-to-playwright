class ArticlePage {
  constructor(page) {
    this.page = page;
  }

  async visitNewArticle() {
    await this.page.goto('https://demo.realworld.io/#/editor');
  }

  getTitleInput() {
    return this.page.locator('input[placeholder="Article Title"]');
  }

  getDescriptionInput() {
    return this.page.locator('input[placeholder="What\'s this article about?"]');
  }

  getBodyInput() {
    return this.page.locator('textarea[placeholder="Write your article (in markdown)"]');
  }

  getTagsInput() {
    return this.page.locator('input[placeholder="Enter tags"]');
  }

  getPublishButton() {
    return this.page.getByRole('button', { name: 'Publish Article' });
  }

  async createArticle(title, description, body, tags = []) {
    await this.visitNewArticle();
    await this.getTitleInput().fill(title);
    await this.getDescriptionInput().fill(description);
    await this.getBodyInput().fill(body);
    
    for (const tag of tags) {
      await this.getTagsInput().fill(tag);
      await this.getTagsInput().press('Enter');
    }
    
    await this.getPublishButton().click();
  }

  getArticleTitle() {
    return this.page.locator('h1');
  }

  getArticleBody() {
    return this.page.locator('.article-content');
  }

  async deleteArticle() {
    await this.page.getByRole('button', { name: 'Delete Article' }).click();
  }

  async editArticle() {
    await this.page.getByRole('link', { name: 'Edit Article' }).click();
  }

  async favoriteArticle() {
    await this.page.locator('.btn-outline-primary').filter({ hasText: 'Favorite' }).click();
  }

  async followAuthor() {
    await this.page.locator('.btn-outline-secondary').filter({ hasText: 'Follow' }).click();
  }

  async addComment(comment) {
    await this.page.locator('textarea[placeholder="Write a comment..."]').fill(comment);
    await this.page.getByRole('button', { name: 'Post Comment' }).click();
  }

  async deleteComment(index = 0) {
    await this.page.locator('.card').nth(index).locator('.ion-trash-a').click();
  }

  getComments() {
    return this.page.locator('.card');
  }
}

module.exports = { ArticlePage };
