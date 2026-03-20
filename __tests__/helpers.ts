import { Page } from '@playwright/test';
import ui from './locale';
import inputTexts from './input-texts';
import { User, TaskInput } from './types';
import { BasePage } from './pages/base-page';
import { LoginPage, RegisterPage } from './pages/auth-pages';
import { StatusesPage } from './pages/statuses-page';
import { LabelsPage } from './pages/labels-page';
import { TasksPage } from './pages/tasks-page';
import { UsersPage } from './pages/users-page';

const random = () =>
  Math.random().toString(36).slice(2, 6) + Date.now().toString(36);

export function makeUser(): User {
  const suffix = random();
  const firstName = inputTexts.users.firstName.tests;
  const lastName = `${inputTexts.users.lastNamePrefix.tests}-${suffix}`;
  const username = `${inputTexts.users.usernamePrefix.tests}-${suffix}`;
  const password = `${inputTexts.users.passwordPrefix}${suffix}`;
  return {
    firstName,
    lastName,
    username,
    password,
    fullName: `${firstName} ${lastName}`,
  };
}

export async function registerUser(page: Page, user: User) {
  const register = new RegisterPage(page);
  await register.register(user);
}

export async function login(page: Page, user: User) {
  const loginPage = new LoginPage(page);
  await loginPage.login(user);
}

export async function logout(page: Page) {
  const base = new BasePage(page);
  await base.logout();
}

export function getLogoutControl(page: Page) {
  const base = new BasePage(page);
  return base.logoutControl();
}

export async function ensureLoggedIn(page: Page, user: User) {
  await page.goto('/');
  if (await page.getByRole('link', { name: ui.links.logout }).isVisible()) {
    return;
  }
  await login(page, user);
}

export async function createStatus(page: Page, name: string) {
  const statuses = new StatusesPage(page);
  await statuses.create(name);
}

export async function updateStatus(page: Page, currentName: string, updatedName: string) {
  const statuses = new StatusesPage(page);
  await statuses.openEdit(currentName);
  await statuses.updateName(updatedName);
}

export async function deleteStatus(page: Page, name: string) {
  const statuses = new StatusesPage(page);
  await statuses.openDelete(name);
  await statuses.confirmDelete();
}

export async function createLabel(page: Page, name: string) {
  const labels = new LabelsPage(page);
  await labels.create(name);
}

export async function updateLabel(page: Page, currentName: string, updatedName: string) {
  const labels = new LabelsPage(page);
  await labels.openEdit(currentName);
  await labels.updateName(updatedName);
}

export async function deleteLabel(page: Page, name: string) {
  const labels = new LabelsPage(page);
  await labels.openDelete(name);
  await labels.confirmDelete();
}

export async function createTask(page: Page, task: TaskInput) {
  const tasks = new TasksPage(page);
  await tasks.create(task);
}

export async function openTask(page: Page, taskName: string) {
  const tasks = new TasksPage(page);
  await tasks.openShow(taskName);
}

export async function updateTask(page: Page, taskName: string, task: TaskInput) {
  const tasks = new TasksPage(page);
  await tasks.openEdit(taskName);
  await tasks.update(task);
}

export async function requestTaskDelete(page: Page, taskName: string) {
  const tasks = new TasksPage(page);
  await tasks.openDelete(taskName);
}

export async function deleteTask(page: Page, taskName: string) {
  const tasks = new TasksPage(page);
  await tasks.openDelete(taskName);
  await tasks.confirmDelete();
}

export async function updateCurrentUser(page: Page, currentFullName: string, user: User) {
  const users = new UsersPage(page);
  await users.open();
  await users.openEdit(currentFullName);
  await users.updateUser(user);
}

export async function deleteCurrentUser(page: Page, fullName: string) {
  const users = new UsersPage(page);
  await users.open();
  await users.openDelete(fullName);
  await users.confirmDelete();
}

export function makeStatusName() {
  return `${inputTexts.entities.statusPrefix.tests}-${random()}`;
}

export function makeLabelName() {
  return `${inputTexts.entities.labelPrefix.tests}-${random()}`;
}

export function makeTaskName() {
  return `${inputTexts.entities.taskPrefix.tests}-${random()}`;
}
