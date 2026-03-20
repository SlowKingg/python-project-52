import { test, expect } from '@playwright/test';
import { makeUser, makeStatusName } from './helpers';
import ui from './locale';
import { LoginPage, RegisterPage } from './pages/auth-pages';
import { BasePage } from './pages/base-page';
import { StatusesPage } from './pages/statuses-page';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  const user = makeUser();
  const register = new RegisterPage(page);
  const login = new LoginPage(page);
  const base = new BasePage(page);
  await register.register(user);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);
});

test('create status', async ({ page }) => {
  const name = makeStatusName();
  const statuses = new StatusesPage(page);
  const base = new BasePage(page);
  await statuses.create(name);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await expect(page.getByText(name)).toBeVisible();
});

test('update status', async ({ page }) => {
  const original = makeStatusName();
  const statuses = new StatusesPage(page);
  const base = new BasePage(page);
  await statuses.create(original);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await statuses.openEdit(original);
  await expect(page).toHaveURL(/\/statuses\/\d+\/update\/$/);

  const updated = makeStatusName();
  await statuses.updateName(updated);
  await expect(base.alert()).toContainText(ui.alerts.statusUpdated);
  await expect(page.getByText(updated)).toBeVisible();
});

test('delete status', async ({ page }) => {
  const name = makeStatusName();
  const statuses = new StatusesPage(page);
  const base = new BasePage(page);
  await statuses.create(name);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await statuses.openDelete(name);
  await expect(page).toHaveURL(/\/statuses\/\d+\/delete\/$/);
  await statuses.confirmDelete();
  await expect(base.alert()).toContainText(ui.alerts.statusDeleted);
  await expect(page).toHaveURL(/\/statuses\/$/);
});

test('cannot create duplicate status name', async ({ page }) => {
  const name = makeStatusName();
  const statuses = new StatusesPage(page);
  const base = new BasePage(page);

  await statuses.create(name);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await statuses.create(name);

  await expect(page).toHaveURL(/\/statuses\/create\/$/);
  await expect(page.getByText(ui.validation.duplicateEntry)).toBeVisible();
});
