import { Page, Locator } from '@playwright/test';
import ui from '../locale';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  alert(): Locator {
    return this.page.locator('.alert');
  }

  logoutControl(): Locator {
    return this.page
      .getByRole('link', { name: ui.links.logout })
      .or(this.page.getByRole('button', { name: ui.links.logout }));
  }

  async submitByButton(name: string) {
    await this.page.getByRole('button', { name }).click();
    await this.page.waitForLoadState();
  }

  async logout() {
    await this.logoutControl().click();
    await this.page.waitForLoadState();
  }
}
