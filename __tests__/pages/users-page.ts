import ui from '../locale';
import { User } from '../types';
import { BasePage } from './base-page';

export class UsersPage extends BasePage {
  async open() {
    await this.goto('/users/');
  }

  private rowByName(fullName: string) {
    return this.page.locator('tr', { hasText: fullName });
  }

  async openEdit(fullName: string) {
    const row = this.rowByName(fullName);
    await row.getByRole('link', { name: ui.actions.edit }).click();
  }

  async updateUser(user: User) {
    await this.page.getByLabel(ui.fields.firstName, { exact: true }).fill(user.firstName);
    await this.page.getByLabel(ui.fields.lastName, { exact: true }).fill(user.lastName);
    await this.page.getByLabel(ui.fields.username, { exact: true }).fill(user.username);
    await this.page.getByLabel(ui.fields.password, { exact: true }).fill(user.password);
    await this.page.getByLabel(ui.fields.passwordConfirm, { exact: true }).fill(user.password);
    await this.submitByButton(ui.buttons.submitUpdate);
  }

  async openDelete(fullName: string) {
    const row = this.rowByName(fullName);
    await row.getByRole('link', { name: ui.actions.delete }).click();
  }

  async confirmDelete() {
    await this.submitByButton(ui.buttons.confirmDelete);
  }
}
