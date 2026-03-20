import ui from '../locale';
import { User } from '../types';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  async open() {
    await this.goto('/login/');
  }

  async login(user: User) {
    await this.open();
    await this.page.getByLabel(ui.fields.username).fill(user.username);
    await this.page.getByLabel(ui.fields.password).fill(user.password);
    await this.submitByButton(ui.buttons.submitLogin);
  }
}

export class RegisterPage extends BasePage {
  async open() {
    await this.goto('/users/create/');
  }

  async register(user: User) {
    await this.open();
    await this.page.getByLabel(ui.fields.firstName, { exact: true }).fill(user.firstName);
    await this.page.getByLabel(ui.fields.lastName, { exact: true }).fill(user.lastName);
    await this.page.getByLabel(ui.fields.username, { exact: true }).fill(user.username);
    await this.page.getByLabel(ui.fields.password, { exact: true }).fill(user.password);
    await this.page.getByLabel(ui.fields.passwordConfirm, { exact: true }).fill(user.password);
    await this.submitByButton(ui.buttons.submitRegister);
  }
}
