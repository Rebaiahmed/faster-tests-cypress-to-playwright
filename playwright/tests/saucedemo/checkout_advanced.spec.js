const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../page-objects/LoginPage');
const { ProductPage } = require('../../page-objects/ProductPage');
const { CartPage } = require('../../page-objects/CartPage');
const { CheckoutPage } = require('../../page-objects/CheckoutPage');

test.describe('Advanced Checkout Tests', () => {
  let loginPage, productPage, cartPage, checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productPage.addToCartById('sauce-labs-backpack');
    await page.locator('.shopping_cart_link').click();
  });

  test('Should display checkout button', async ({ page }) => {
    await expect(page.locator('.checkout_button')).toBeVisible();
  });

  test('Should navigate to checkout page', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('Should display first name field', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  });

  test('Should display last name field', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
  });

  test('Should display postal code field', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('Should show error when first name is empty', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('', 'Doe', '12345');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should show error when last name is empty', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', '', '12345');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should show error when postal code is empty', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('Should proceed to overview with valid information', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('Should display order summary', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await expect(page.locator('.cart_item')).toBeVisible();
  });

  test('Should display payment information', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await expect(page.locator('.summary_info')).toBeVisible();
  });

  test('Should display shipping information', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    // Wait for summary page to load
    await page.waitForSelector('.summary_info', { timeout: 10000 });
    // Check shipping info specifically using data-test attribute
    await expect(page.locator('[data-test="shipping-info-value"]')).toBeVisible();
  });

  test('Should display item total', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
  });

  test('Should display tax', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await expect(page.locator('.summary_tax_label')).toBeVisible();
  });

  test('Should display total with tax', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('Should calculate tax correctly', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const subtotalValue = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const taxValue = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    expect(taxValue).toBeGreaterThan(0);
  });

  test('Should display finish button', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await expect(page.locator('.btn_action')).toBeVisible();
  });

  test('Should display cancel button on checkout', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await expect(page.locator('.cart_cancel_link')).toBeVisible();
  });

  test('Should return to cart when clicking cancel', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await page.locator('.cart_cancel_link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
  });

  test('Should complete order successfully', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
  });

  test('Should display order confirmation message', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await expect(page.locator('.complete-header')).toContainText('Thank you for your order');
  });

  test('Should display back home button after order', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await expect(page.locator('.btn_primary')).toBeVisible();
  });

  test('Should return to products after order completion', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await page.locator('.btn_primary').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Should clear cart after order completion', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.enterCustomerInfo('John', 'Doe', '12345');
    await checkoutPage.finishCheckout();
    await page.locator('.btn_primary').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
