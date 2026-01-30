class CartPage {
  constructor(page) {
    this.page = page;
  }

  async removeItemById(productId) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async proceedToCheckout() {
    await this.page.locator('[data-test="checkout"]').click();
  }

  async getCartItems() {
    return this.page.locator('.cart_item');
  }
}

module.exports = { CartPage };
