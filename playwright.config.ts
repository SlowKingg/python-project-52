import { defineConfig, devices } from '@playwright/test';

process.env.LOCALE ??= 'ru';
const quietE2E = process.env.E2E_QUIET !== '0';

export default defineConfig({
  testDir: './__tests__',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: quietE2E ? 'dot' : 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:8000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'uv run python manage.py runserver 127.0.0.1:8000',
    url: 'http://127.0.0.1:8000',
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: quietE2E ? 'ignore' : 'pipe',
    stderr: quietE2E ? 'ignore' : 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});

