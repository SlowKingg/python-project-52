import ui from '../locale';
import { BasePage } from './base-page';

export class StatusesPage extends BasePage {
  async open() {
    await this.goto('/statuses/');
  }

  async create(name: string) {
    await this.open();
    await this.page.getByRole('link', { name: ui.buttons.createStatus }).click();
    await this.page.getByLabel(ui.fields.statusName).fill(name);
    await this.submitByButton(ui.buttons.submitCreate);
  }

  async openEdit(name: string) {
    await this.open();
    const row = this.page.locator('tr', { hasText: name });
    await row.getByRole('link', { name: ui.actions.edit }).click();
  }

  async updateName(name: string) {
    await this.page.getByLabel(ui.fields.statusName).fill(name);
    await this.submitByButton(ui.buttons.submitUpdate);
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
