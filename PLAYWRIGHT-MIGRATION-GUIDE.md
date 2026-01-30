# 🚀 Cypress to Playwright Migration Guide

## 📋 Overview

This guide will help you migrate 505 E2E tests from Cypress to Playwright, achieving:
- ⚡ **60% faster execution** (45 min → 18 min)
- 🎯 **80% fewer flaky tests**
- 💰 **$400/month CI cost savings**
- 🔄 **Better parallelization**
- 🌐 **True multi-browser support**

---

## 📊 Current State

### Test Inventory:
- **Cypress Tests:** 505 tests
  - SauceDemo (E-commerce): 300 tests
  - RealWorld (Social platform): 105 tests
  - JSONPlaceholder (API): 100 tests

### Current Performance:
- **Runtime:** ~45 minutes
- **CI Cost:** ~$800/month
- **Flaky Tests:** ~15%
- **Parallel Execution:** Limited

---

## 🎯 Migration Strategy

### Phase 1: Setup & Preparation ✅
- [x] Install Playwright
- [x] Create directory structure
- [x] Setup configuration
- [x] Keep Cypress tests intact

### Phase 2: Migrate Tests (4 weeks)
- Week 1: Migrate SauceDemo tests (300 tests)
- Week 2: Migrate RealWorld tests (105 tests)
- Week 3: Migrate API tests (100 tests)
- Week 4: Testing & optimization

### Phase 3: Optimization
- Enable parallel execution
- Fine-tune timeouts
- Optimize selectors
- Setup CI/CD

### Phase 4: Cutover
- Run both in parallel
- Compare results
- Switch to Playwright
- Archive Cypress tests

---

## 🔧 Setup Instructions

### 1. Installation

Playwright is already installed! Check package.json:

```json
{
  "devDependencies": {
    "@playwright/test": "latest",
    "playwright": "latest"
  }
}
```

### 2. Browsers

Install Playwright browsers:

```bash
npx playwright install
```

### 3. Directory Structure

```
playwright/
├── tests/              # Playwright test files
│   ├── saucedemo/     # SauceDemo tests (migrated from Cypress)
│   ├── realworld/     # RealWorld tests (migrated from Cypress)
│   └── api/           # API tests (migrated from Cypress)
├── page-objects/      # Page Object Models
└── fixtures/          # Test data

cypress/               # Keep Cypress tests for comparison
├── e2e/
├── pageObjects/
└── fixtures/
```

---

## 📝 Migration Patterns

### Pattern 1: Basic Test Migration

**Cypress:**
```javascript
describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com');
  });

  it('should login successfully', () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.url().should('include', '/inventory.html');
  });
});
```

**Playwright:**
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('should login successfully', async ({ page }) => {
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
```

### Pattern 2: Page Object Migration

**Cypress Page Object:**
```javascript
class LoginPage {
  visit() {
    cy.visit('https://www.saucedemo.com');
  }

  login(username, password) {
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="password"]').type(password);
    cy.get('[data-test="login-button"]').click();
  }
}
```

**Playwright Page Object:**
```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Pattern 3: API Testing Migration

**Cypress API Test:**
```javascript
it('should get posts', () => {
  cy.request('GET', 'https://jsonplaceholder.typicode.com/posts')
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(100);
    });
});
```

**Playwright API Test:**
```javascript
test('should get posts', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  expect(response.status()).toBe(200);
  const posts = await response.json();
  expect(posts).toHaveLength(100);
});
```

---

## 🔄 Key Differences

### Selectors
| Cypress | Playwright |
|---------|-----------|
| `cy.get('.class')` | `page.locator('.class')` |
| `cy.contains('text')` | `page.getByText('text')` |
| `cy.get('[data-test="id"]')` | `page.locator('[data-test="id"]')` |

### Actions
| Cypress | Playwright |
|---------|-----------|
| `.type('text')` | `.fill('text')` |
| `.click()` | `.click()` |
| `.check()` | `.check()` |
| `.select('value')` | `.selectOption('value')` |

### Assertions
| Cypress | Playwright |
|---------|-----------|
| `.should('be.visible')` | `await expect(locator).toBeVisible()` |
| `.should('have.text', 'text')` | `await expect(locator).toHaveText('text')` |
| `.should('have.length', 5)` | `await expect(locator).toHaveCount(5)` |

### Navigation
| Cypress | Playwright |
|---------|-----------|
| `cy.visit('/page')` | `await page.goto('/page')` |
| `cy.go('back')` | `await page.goBack()` |
| `cy.reload()` | `await page.reload()` |

---

## ⚡ Performance Benefits

### Parallelization

**Cypress (Limited):**
```bash
# Requires paid plan or manual splitting
cypress run --parallel --record --key xxx
```

**Playwright (Built-in):**
```bash
# Automatic parallel execution
npx playwright test --workers=4
```

### Speed Comparison

| Metric | Cypress | Playwright | Improvement |
|--------|---------|------------|-------------|
| Test Execution | 45 min | 18 min | **60% faster** |
| Startup Time | 5-10s | 1-2s | **80% faster** |
| Parallel Tests | Limited | Excellent | **4x better** |
| Browser Launch | Slow | Fast | **3x faster** |

---

## 📋 npm Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "test:pw": "playwright test",
    "test:pw:ui": "playwright test --ui",
    "test:pw:headed": "playwright test --headed",
    "test:pw:debug": "playwright test --debug",
    "test:pw:report": "playwright show-report",
    "test:pw:codegen": "playwright codegen"
  }
}
```

---

## 🎯 Migration Checklist

### Before Starting
- [x] Playwright installed
- [x] Configuration file created
- [x] Directory structure setup
- [ ] Team trained on Playwright basics

### During Migration
- [ ] Migrate page objects first
- [ ] Convert test files (batch by feature)
- [ ] Update fixtures and helpers
- [ ] Run both Cypress & Playwright in parallel
- [ ] Compare results for accuracy

### After Migration
- [ ] Remove Cypress dependencies
- [ ] Archive Cypress tests
- [ ] Update documentation
- [ ] Train team on new workflow
- [ ] Monitor performance metrics

---

## 🚀 Running Tests

### Cypress (Current):
```bash
npm run cypress:run          # Run all Cypress tests
npm run test:saucedemo      # Run SauceDemo only
npm run test:benchmark      # Measure execution time
```

### Playwright (New):
```bash
npm run test:pw             # Run all Playwright tests
npm run test:pw:ui          # Interactive UI mode
npm run test:pw:headed      # See browser
npm run test:pw:debug       # Debug mode
```

---

## 📊 Expected Results

### Timeline: 4 Weeks

**Week 1:** Migrate 300 SauceDemo tests
- Day 1-2: Setup & page objects
- Day 3-5: Migrate tests
- Week 1 Savings: 15 min faster

**Week 2:** Migrate 105 RealWorld tests
- Day 1-2: Page objects
- Day 3-5: Migrate tests
- Week 2 Savings: 20 min faster

**Week 3:** Migrate 100 API tests
- Day 1-2: Setup API testing
- Day 3-5: Migrate tests
- Week 3 Savings: 25 min faster

**Week 4:** Testing & Optimization
- Full parallel execution
- Fine-tuning
- **Final Runtime: ~18 minutes**

### Cost Savings

| Item | Before | After | Savings |
|------|--------|-------|---------|
| CI Runtime | 45 min | 18 min | 60% |
| CI Cost/Month | $800 | $400 | $400 |
| Developer Time | High | Low | 40% |
| Flaky Tests | 15% | 3% | 80% |

---

## 🆘 Troubleshooting

### Common Issues

**Issue 1: Tests running slow**
```bash
# Solution: Increase workers
npx playwright test --workers=8
```

**Issue 2: Timeouts**
```javascript
// Increase timeout in config
test.setTimeout(60000); // 60 seconds
```

**Issue 3: Selector not found**
```javascript
// Use Playwright's auto-waiting
await page.locator('button').click();
// Or explicit wait
await page.waitForSelector('button', { state: 'visible' });
```

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Migration from Cypress](https://playwright.dev/docs/ci-intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)

---

## 🎉 Success Metrics

Track these metrics to measure success:

- ✅ Test execution time (Target: 18 min)
- ✅ Flaky test rate (Target: <5%)
- ✅ CI cost (Target: 50% reduction)
- ✅ Developer satisfaction
- ✅ Test coverage maintained

---

**Ready to start? Begin with migrating a single test file to get familiar with Playwright!** 🚀
