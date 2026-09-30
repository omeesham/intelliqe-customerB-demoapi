/**
 * Playwright test fixtures.
 *
 * A thin re-export so specs share a single import for test and expect. Specs
 * instantiate page objects directly, e.g. const login = new LoginPage(page).
 *
 * To inject ready-made page objects later, extend the base test here with
 * page-object fixtures.
 */
export { test, expect } from '@playwright/test';
