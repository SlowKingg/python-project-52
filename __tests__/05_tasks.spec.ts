import { test, expect } from '@playwright/test';
import {
  makeUser,
  makeStatusName,
  makeLabelName,
  makeTaskName,
} from './helpers';
import { LoginPage, RegisterPage } from './pages/auth-pages';
import { BasePage } from './pages/base-page';
import { LabelsPage } from './pages/labels-page';
import { StatusesPage } from './pages/statuses-page';
import { TasksPage } from './pages/tasks-page';
import ui from './locale';
import inputTexts from './input-texts';

test.describe.configure({ mode: 'serial' });

const user = makeUser();
let status1 = '';
let status2 = '';
let label1 = '';
let label2 = '';
let taskName = '';

test('create task', async ({ page }) => {
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

  status1 = makeStatusName();
  status2 = makeStatusName();
  label1 = makeLabelName();
  label2 = makeLabelName();
  await statuses.create(status1);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await statuses.create(status2);
  await expect(base.alert()).toContainText(ui.alerts.statusCreated);
  await labels.create(label1);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);
  await labels.create(label2);
  await expect(base.alert()).toContainText(ui.alerts.labelCreated);

  taskName = makeTaskName();
  await tasks.create({
    name: taskName,
    description: inputTexts.taskDescriptions.tests.created,
    status: status1,
    executor: user.fullName,
    labels: [label1, label2],
  });
  await expect(base.alert()).toContainText(ui.alerts.taskCreated);
  await expect(page.getByText(taskName)).toBeVisible();
});

test('view task', async ({ page }) => {
  const login = new LoginPage(page);
  const tasks = new TasksPage(page);
  const base = new BasePage(page);

  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);

  await tasks.openShow(taskName);
  await expect(page.getByText(taskName)).toBeVisible();
  await expect(page.getByText(inputTexts.taskDescriptions.tests.created)).toBeVisible();
  await expect(page.getByText(status1)).toBeVisible();
  await expect(page.getByText(label1)).toBeVisible();
  await expect(page.getByText(label2)).toBeVisible();
});

test('update task', async ({ page }) => {
  const login = new LoginPage(page);
  const tasks = new TasksPage(page);
  const base = new BasePage(page);

  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);

  await tasks.openEdit(taskName);
  await expect(page).toHaveURL(/\/tasks\/\d+\/update\/$/);
  const updatedName = makeTaskName();
  await tasks.update({
    name: updatedName,
    description: inputTexts.taskDescriptions.tests.updated,
    status: status2,
    labels: [label1],
    executor: user.fullName,
  });
  await expect(base.alert()).toContainText(ui.alerts.taskUpdated);
  await expect(page.getByText(updatedName)).toBeVisible();
  taskName = updatedName;
});

test('delete task', async ({ page }) => {
  const login = new LoginPage(page);
  const tasks = new TasksPage(page);
  const base = new BasePage(page);

  await login.login(user);
  await expect(base.alert()).toContainText(ui.alerts.loggedIn);

  await tasks.openDelete(taskName);
  await expect(page).toHaveURL(/\/tasks\/\d+\/delete\/$/);
  await tasks.confirmDelete();
  await expect(base.alert()).toContainText(ui.alerts.taskDeleted);
  await expect(page.getByRole('link', { name: taskName })).toHaveCount(0);
});

test('cannot create duplicate task name', async ({ page }) => {
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

  const duplicateName = makeTaskName();
  await tasks.create({
    name: duplicateName,
    description: inputTexts.taskDescriptions.tests.firstDuplicateCheck,
    status,
    labels: [label],
    executor: user.fullName,
  });
  await expect(base.alert()).toContainText(ui.alerts.taskCreated);

  await tasks.create({
    name: duplicateName,
    description: inputTexts.taskDescriptions.tests.secondDuplicateCheck,
    status,
    labels: [label],
    executor: user.fullName,
  });

  await expect(page).toHaveURL(/\/tasks\/create\/$/);
  await expect(page.getByText(ui.validation.duplicateEntry)).toBeVisible();
});
