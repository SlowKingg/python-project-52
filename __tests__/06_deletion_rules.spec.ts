import { test, expect } from '@playwright/test';
import {
  makeUser,
  makeStatusName,
  makeLabelName,
  makeTaskName,
} from './helpers';
import ui from './locale';
import inputTexts from './input-texts';
import { LoginPage, RegisterPage } from './pages/auth-pages';
import { LabelsPage } from './pages/labels-page';
import { StatusesPage } from './pages/statuses-page';
import { TasksPage } from './pages/tasks-page';
import { BasePage } from './pages/base-page';

test.describe.configure({ mode: 'serial' });

test('status linked to task cannot be deleted', async ({ page }) => {
  const user = makeUser();
  const register = new RegisterPage(page);
  const login = new LoginPage(page);
  const statuses = new StatusesPage(page);
  const labels = new LabelsPage(page);
  const tasks = new TasksPage(page);
  const base = new BasePage(page);

  await register.register(user);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);

  const status = makeStatusName();
  const label = makeLabelName();
  await statuses.create(status);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await labels.create(label);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);
  await tasks.create({
    name: makeTaskName(),
    description: inputTexts.taskDescriptions.tests.linked,
    status,
    labels: [label],
  });
  await expect(base.alert()).toContainText(ui.alerts.taskCreated);

  await statuses.openDelete(status);
  await expect(page).toHaveURL(/\/statuses\/\d+\/delete\/$/);
  await statuses.confirmDelete();
  await expect(base.alert()).toContainText(ui.alerts.cannotDeleteStatus);
});

test('label linked to task cannot be deleted', async ({ page }) => {
  const user = makeUser();
  const register = new RegisterPage(page);
  const login = new LoginPage(page);
  const statuses = new StatusesPage(page);
  const labels = new LabelsPage(page);
  const tasks = new TasksPage(page);
  const base = new BasePage(page);

  await register.register(user);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);

  const status = makeStatusName();
  const label = makeLabelName();
  await statuses.create(status);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await labels.create(label);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);
  await tasks.create({
    name: makeTaskName(),
    description: inputTexts.taskDescriptions.tests.linked,
    status,
    labels: [label],
  });
  await expect(base.alert()).toContainText(ui.alerts.taskCreated);

  await labels.openDelete(label);
  await expect(page).toHaveURL(/\/labels\/\d+\/delete\/$/);
  await labels.confirmDelete();
  await expect(base.alert()).toContainText(ui.alerts.cannotDeleteLabel);
});

test('only author can delete task', async ({ page }) => {
  const author = makeUser();
  const other = makeUser();

  // Create task as author
  const register = new RegisterPage(page);
  const login = new LoginPage(page);
  const statuses = new StatusesPage(page);
  const tasks = new TasksPage(page);
  const base = new BasePage(page);

  await register.register(author);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await login.login(author);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);
  const status = makeStatusName();
  await statuses.create(status);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  const taskName = makeTaskName();
  await tasks.create({
    name: taskName,
    description: inputTexts.taskDescriptions.tests.authorOwned,
    status,
  });
  await expect(base.alert()).toContainText(ui.alerts.taskCreated);
  await base.logout();
  await expect(base.alert()).toContainText(ui.alerts.loggedOut);

  // Another user attempts deletion
  await register.register(other);
  await expect(base.alert()).toContainText(ui.alerts.userCreated);
  await login.login(other);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);
  await tasks.open();
  await tasks.openDelete(taskName);
  await expect(page).toHaveURL(/\/tasks\/$/);
  await expect(base.alert()).toContainText(ui.alerts.onlyAuthorDelete);
});
