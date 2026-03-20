import { test, expect } from '@playwright/test';
import { makeUser } from './helpers';
import ui from './locale';
import { LoginPage, RegisterPage } from './pages/auth-pages';
import { BasePage } from './pages/base-page';
import { UsersPage } from './pages/users-page';

test.describe.configure({ mode: 'serial' });

test('user registration shows in list', async ({ page }) => {
  const user = makeUser();
  const register = new RegisterPage(page);
  const users = new UsersPage(page);
  const base = new BasePage(page);

  await register.register(user);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await users.open();
  await expect(page.getByText(user.fullName)).toBeVisible();
  await expect(page.getByText(user.username)).toBeVisible();
});

test('user can update own profile', async ({ page }) => {
  const user = makeUser();
  const register = new RegisterPage(page);
  const login = new LoginPage(page);
  const users = new UsersPage(page);
  const base = new BasePage(page);

  await register.register(user);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);

  await users.open();
  await users.openEdit(user.fullName);
  await expect(page).toHaveURL(/\/users\/\d+\/update\/$/);

  const updated = makeUser();
  await users.updateUser(updated);
  await expect(base.alert()).toContainText(ui.alerts.userUpdated);
  await expect(page.getByText(updated.fullName)).toBeVisible();
  await expect(page.getByText(updated.username)).toBeVisible();
});

test('user can delete self', async ({ page }) => {
  const user = makeUser();
  const register = new RegisterPage(page);
  const login = new LoginPage(page);
  const users = new UsersPage(page);
  const base = new BasePage(page);

  await register.register(user);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);

  await users.open();
  await users.openDelete(user.fullName);
  await expect(page).toHaveURL(/\/users\/\d+\/delete\/$/);
  await users.confirmDelete();
  await expect(base.alert()).toContainText(ui.alerts.userDeleted);
  await expect(page.getByRole('link', { name: ui.links.login })).toBeVisible();
});

test('cannot register with duplicate username', async ({ page }) => {
  const original = makeUser();
  const register = new RegisterPage(page);
  const base = new BasePage(page);

  await register.register(original);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);

  const duplicate = makeUser();
  duplicate.username = original.username;
  await register.register(duplicate);

  await expect(page).toHaveURL(/\/users\/create\/$/);
  await expect(page.getByText(ui.validation.duplicateEntry)).toBeVisible();
});
