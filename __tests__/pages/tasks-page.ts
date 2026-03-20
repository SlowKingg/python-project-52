import ui from '../locale';
import { TaskInput } from '../types';
import { BasePage } from './base-page';
import { TaskFormPage } from './task-form-page';

export class TasksPage extends BasePage {
  async open() {
    await this.goto('/tasks/');
  }

  async openCreate() {
    await this.open();
    await this.page
      .getByRole('link', { name: ui.buttons.createTask })
      .or(this.page.getByRole('button', { name: ui.buttons.createTask }))
      .first()
      .click();
  }

  async create(task: TaskInput) {
    await this.openCreate();
    const form = new TaskFormPage(this.page);
    await form.fill(task);
    await form.submitCreate();
    await this.page.waitForLoadState();
  }

  async openShow(name: string) {
    await this.open();
    await this.page.getByRole('link', { name }).click();
  }

  async openEdit(name: string) {
    await this.open();
    const row = this.page.locator('tr', { hasText: name });
    await row.getByRole('link', { name: ui.actions.edit }).click();
  }

  async update(task: TaskInput) {
    const form = new TaskFormPage(this.page);
    await form.fill(task);
    await form.submitUpdate();
    await this.page.waitForLoadState();
  }

  async openDelete(name: string) {
    await this.open();
    const row = this.page.locator('tr', { hasText: name });
    await row.getByRole('link', { name: ui.actions.delete }).click();
  }

  async confirmDelete() {
    await this.submitByButton(ui.buttons.confirmDelete);
  }
}
