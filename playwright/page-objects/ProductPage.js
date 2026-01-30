class ProductPage {
  constructor(page) {
    this.page = page;
  }

  async addToCartById(productId) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async applyFilter(filterOption) {
    await this.page.locator('[data-test="product-sort-container"]').selectOption(filterOption);
  }

  async getCartBadge() {
    return this.page.locator('.shopping_cart_badge');
  }

  async getInventoryItems() {
    return this.page.locator('.inventory_item');
  }
}

module.exports = { ProductPage };
