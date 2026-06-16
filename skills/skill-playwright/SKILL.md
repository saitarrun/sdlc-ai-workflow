---
name: skill-playwright
description: Browser automation and end-to-end testing with Playwright. Use when building/testing frontends, automating user workflows, taking screenshots, validating UI state, filling forms, testing across browsers, or mentions "playwright", "E2E test", "browser automation", "screenshot".
version: 1.0.0
---

# Skill: Playwright Browser Automation

Browser automation, visual testing, and end-to-end test generation with Playwright. Launch browsers, navigate pages, interact with the DOM, capture screenshots, validate UI state, run multi-browser tests.

## Use Cases

**End-to-end testing** — User flows from login → action → verification. Tests through public UI, not mocks.

**Visual validation** — Screenshots for design regression, visual diffs, accessibility checks.

**Form automation** — Fill complex forms, validate errors, test input constraints.

**Cross-browser testing** — Run same tests against Chromium, Firefox, Safari.

**Prototype validation** — Verify prototype UI behavior, click flows, state transitions.

**Accessibility testing** — Check ARIA labels, keyboard navigation, color contrast via Playwright + axe.

## Patterns

### 1. Setup & Config

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
});
```

### 2. Page Object Model (DRY selectors)

```typescript
// e2e/pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### 3. Test Structure (Given-When-Then)

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('user can login with valid credentials', async ({ page }) => {
    // Given: user is on login page (beforeEach)
    
    // When: user enters credentials and submits
    await loginPage.login('user@example.com', 'password123');
    
    // Then: redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('user sees error on invalid credentials', async () => {
    // When: user enters wrong password
    await loginPage.login('user@example.com', 'wrong');
    
    // Then: error message shown
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });
});
```

### 4. Visual Testing

```typescript
test('dashboard layout matches snapshot', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Screenshot for visual regression
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

### 5. API Mocking (test offline flows)

```typescript
test('shows error when API fails', async ({ page }) => {
  // Mock API endpoint to simulate failure
  await page.route('**/api/data', route => {
    route.abort('failed');
  });

  await page.goto('/');
  
  // Verify error UI shown
  await expect(page.locator('[role="alert"]')).toContainText('Failed to load');
});
```

## Best Practices

**Use Page Object Model** — Centralize selectors, reduce duplication, make refactors trivial.

**One assertion per test** — Tests are faster, failures are clear, parallelization improves.

**Use locators, not CSS strings** — `page.locator('button:has-text("Login")')` is expressive, maintainable.

**Wait for readiness, not time** — `page.waitForLoadState()`, `expect(locator).toBeVisible()`, never `sleep()`.

**Test behavior, not implementation** — Click buttons, fill forms, check what users see. Don't query internal state.

**Mock external APIs** — Tests run offline, fast, deterministic. Only test your code.

**Run in CI with retries** — Transient failures happen; retries catch flakes without making tests slower locally.

## Commands

```bash
# Run all tests
npx playwright test

# Run single file
npx playwright test e2e/auth.spec.ts

# Run tests matching pattern
npx playwright test -g "login"

# Debug mode (opens inspector)
npx playwright test --debug

# UI mode (visual test runner)
npx playwright test --ui

# Generate test from recording
npx playwright codegen http://localhost:3000
```

## Integration with SDLC

**Phase 2 (Design)**: Prototype validation — verify UI flows work as designed
**Phase 3 (Dev)**: Feature tests during implementation — TDD for E2E
**Phase 4 (Test)**: Full E2E test suite, visual regression, accessibility
**Phase 5 (Deploy)**: Pre-deployment smoke tests, cross-browser validation

---

**Status**: Ready for E2E test generation and browser automation  
**Best for**: Frontend testing, design validation, cross-browser coverage, accessibility verification
