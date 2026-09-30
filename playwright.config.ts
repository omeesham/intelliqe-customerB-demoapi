import { defineConfig, devices } from '@playwright/test';
import { env } from './common/env';

/**
 * Playwright configuration — environment-agnostic, Page Object Model.
 *
 * Chromium by default. Runs fully in parallel. Saves a video AND a trace for
 * EVERY test (not just failures) so every run is fully reproducible. All
 * behavior is driven by variables in .env (see .env.example).
 */
export default defineConfig({
  testDir: './tests',
  // Closes the shared DB pool (if a test opened one) after the run so the
  // Node process exits cleanly. Safe no-op when no test touched the database.
  globalTeardown: './common/global-teardown.ts',
  // Traces, videos and screenshots for every test land here.
  outputDir: './traces',
  fullyParallel: true,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.WORKERS,
  timeout: env.TIMEOUT,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './report/html' }],
    ['junit', { outputFile: './report/junit.xml' }],
    ['json', { outputFile: './logs/test-results.json' }],
  ],
  use: {
    baseURL: env.BASE_URL,
    headless: env.HEADLESS,
    // Always-on: capture a trace and a video for every test execution.
    trace: 'on',
    video: 'on',
    screenshot: 'only-on-failure',
  },
  // Chromium is the default browser. Add firefox/webkit projects here if needed.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
