import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — the contract every page object extends.
 *
 * Page objects encapsulate the selectors and interactions for one page (or a
 * cohesive area of one). Specs talk to page objects, never to raw selectors —
 * that is the whole point of the Page Object Model: when the UI changes, you fix
 * one page object, not dozens of tests.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path relative to the configured baseURL (or a full URL). */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Wait until a locator is visible (auto-waiting; no fixed sleeps). */
  async waitForVisible(locator: Locator, timeout = 15000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /** Current page title. */
  async title(): Promise<string> {
    return this.page.title();
  }
}
