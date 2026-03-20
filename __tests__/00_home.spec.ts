import { test, expect } from '@playwright/test';
import ui from './locale';
import { HomePage } from './pages/home-page';

// Simple smoke test: open home page and assert main nav/auth links mimic legacy Python tests.
test('home page renders auth links for guest', async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await expect(home.loginLink()).toBeVisible();
  await expect(home.registerLink()).toBeVisible();
  await expect(home.logoutLink()).toHaveCount(0);
  await expect(page.getByRole('link', { name: ui.links.login })).toBeVisible();
});
