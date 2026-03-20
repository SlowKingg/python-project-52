import { test, expect } from '@playwright/test';
import { makeUser } from './helpers';
import ui from './locale';
import { HomePage } from './pages/home-page';
import { LoginPage, RegisterPage } from './pages/auth-pages';
import { BasePage } from './pages/base-page';

test.describe.configure({ mode: 'serial' });

test('guest sees auth links', async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await expect(home.loginLink()).toBeVisible();
  await expect(home.registerLink()).toBeVisible();
  await expect(home.logoutLink()).toHaveCount(0);
  await expect(page.getByRole('link', { name: ui.links.login })).toBeVisible();
});

const user = makeUser();

test('register user', async ({ page }) => {
  const register = new RegisterPage(page);
  const base = new BasePage(page);
  await register.register(user);
  await expect(page).toHaveURL(/\/login\/$/);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
});

test('login user', async ({ page }) => {
  const login = new LoginPage(page);
  const base = new BasePage(page);

  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);
  await expect(base.logoutControl()).toBeVisible();
});

test('logout user', async ({ page }) => {
  const login = new LoginPage(page);
  const base = new BasePage(page);

  await login.login(user);
  await base.logout();
  await expect(base.alert()).toContainText(ui.alerts.loggedOut);
  await expect(page.getByRole('link', { name: ui.links.login })).toBeVisible();
});
