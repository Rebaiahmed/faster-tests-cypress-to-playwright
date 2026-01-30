class ProfilePage {
  constructor(page) {
    this.page = page;
  }

  async visit(username) {
    await this.page.goto(`https://demo.realworld.io/#/profile/${username}`, { waitUntil: 'networkidle' });
  }

  async visitSettings() {
    await this.page.goto('https://demo.realworld.io/#/settings', { waitUntil: 'networkidle' });
  }

  getFollowButton() {
    return this.page.locator('.btn-outline-secondary').filter({ hasText: 'Follow' });
  }

  getUnfollowButton() {
    return this.page.locator('.btn-secondary').filter({ hasText: 'Unfollow' });
  }

  async followUser() {
    await this.getFollowButton().click();
  }

  async unfollowUser() {
    await this.getUnfollowButton().click();
  }

  getMyArticlesTab() {
    return this.page.getByRole('link', { name: 'My Articles' });
  }

  getFavoritedArticlesTab() {
    return this.page.getByRole('link', { name: 'Favorited Articles' });
  }

  async clickMyArticles() {
    await this.getMyArticlesTab().click();
  }

  async clickFavoritedArticles() {
    await this.getFavoritedArticlesTab().click();
  }

  // Settings page methods
  getImageUrlInput() {
    return this.page.locator('input[placeholder="URL of profile picture"]');
  }

  getUsernameInputSettings() {
    return this.page.locator('input[placeholder="Username"]');
  }

  getBioInput() {
    return this.page.locator('textarea[placeholder="Short bio about you"]');
  }

  getEmailInput() {
    return this.page.locator('input[placeholder="Email"]');
  }

  getPasswordInput() {
    return this.page.locator('input[placeholder="New Password"]');
  }

  async updateSettings(settings) {
    await this.visitSettings();
    
    if (settings.imageUrl) {
      await this.getImageUrlInput().clear();
      await this.getImageUrlInput().fill(settings.imageUrl);
    }
    if (settings.username) {
      await this.getUsernameInputSettings().clear();
      await this.getUsernameInputSettings().fill(settings.username);
    }
    if (settings.bio) {
      await this.getBioInput().clear();
      await this.getBioInput().fill(settings.bio);
    }
    if (settings.email) {
      await this.getEmailInput().clear();
      await this.getEmailInput().fill(settings.email);
    }
    if (settings.password) {
      await this.getPasswordInput().fill(settings.password);
    }
    
    await this.page.getByRole('button', { name: 'Update Settings' }).click();
  }

  async logout() {
    await this.visitSettings();
    await this.page.getByRole('button', { name: /logout/i }).click();
  }
}

module.exports = { ProfilePage };
