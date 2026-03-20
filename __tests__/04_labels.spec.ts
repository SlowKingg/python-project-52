import { test, expect } from '@playwright/test';
import { makeUser, makeLabelName } from './helpers';
import ui from './locale';
import { LoginPage, RegisterPage } from './pages/auth-pages';
import { BasePage } from './pages/base-page';
import { LabelsPage } from './pages/labels-page';

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

test('create label', async ({ page }) => {
  const name = makeLabelName();
  const labels = new LabelsPage(page);
  const base = new BasePage(page);
  await labels.create(name);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);
  await expect(page.getByText(name)).toBeVisible();
});

test('update label', async ({ page }) => {
  const original = makeLabelName();
  const labels = new LabelsPage(page);
  const base = new BasePage(page);
  await labels.create(original);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);
  await labels.openEdit(original);
  await expect(page).toHaveURL(/\/labels\/\d+\/update\/$/);

  const updated = makeLabelName();
  await labels.updateName(updated);
  await expect(base.alert()).toContainText(ui.alerts.labelUpdated);
  await expect(page.getByText(updated)).toBeVisible();
});

test('delete label', async ({ page }) => {
  const name = makeLabelName();
  const labels = new LabelsPage(page);
  const base = new BasePage(page);
  await labels.create(name);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);
  await labels.openDelete(name);
  await expect(page).toHaveURL(/\/labels\/\d+\/delete\/$/);
  await labels.confirmDelete();
  await expect(base.alert()).toContainText(ui.alerts.labelDeleted);
  await expect(page).toHaveURL(/\/labels\/$/);
});

test('cannot create duplicate label name', async ({ page }) => {
  const name = makeLabelName();
  const labels = new LabelsPage(page);
  const base = new BasePage(page);

  await labels.create(name);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);
  await labels.create(name);

  await expect(page).toHaveURL(/\/labels\/create\/$/);
  await expect(page.getByText(ui.validation.duplicateEntry)).toBeVisible();
});
