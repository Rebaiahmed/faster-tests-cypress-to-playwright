class AuthPage {
  constructor(page) {
    this.page = page;
  }

  async visitLogin() {
    await this.page.goto('https://demo.realworld.io/#/login', { waitUntil: 'networkidle' });
  }

  async visitRegister() {
    await this.page.goto('https://demo.realworld.io/#/register', { waitUntil: 'networkidle' });
  }

  getEmailInput() {
    return this.page.locator('input[type="email"]');
  }

  getPasswordInput() {
    return this.page.locator('input[type="password"]');
  }

  getUsernameInput() {
    return this.page.locator('input[placeholder="Username"]');
  }

  getSubmitButton() {
    return this.page.locator('button[type="submit"]');
  }

  async login(email, password) {
    await this.visitLogin();
    await this.getEmailInput().fill(email);
    await this.getPasswordInput().fill(password);
    await this.getSubmitButton().click();
  }

  async register(username, email, password) {
    await this.visitRegister();
    await this.getUsernameInput().fill(username);
    await this.getEmailInput().fill(email);
    await this.getPasswordInput().fill(password);
    await this.getSubmitButton().click();
  }

  getErrorMessages() {
    return this.page.locator('.error-messages li');
  }

  async verifyLoggedIn() {
    await this.page.waitForURL(/.*#\//);
    await this.page.getByRole('link', { name: 'New Article' }).waitFor({ state: 'visible' });
  }
}

module.exports = { AuthPage };
