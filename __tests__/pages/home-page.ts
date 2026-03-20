import ui from '../locale';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  async open() {
    await this.goto('/');
  }

  loginLink() {
    return this.page.getByRole('link', { name: ui.links.login });
  }

  registerLink() {
    return this.page.getByRole('link', { name: ui.links.register });
  }

  logoutLink() {
    return this.page.getByRole('link', { name: ui.links.logout });
  }
}
