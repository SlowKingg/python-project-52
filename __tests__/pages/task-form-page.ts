import ui from '../locale';
import { TaskInput } from '../types';
import { BasePage } from './base-page';

export class TaskFormPage extends BasePage {
  async fill(task: TaskInput) {
    await this.page.getByLabel(ui.fields.taskName).fill(task.name);
    await this.page.getByLabel(ui.fields.taskDescription).fill(task.description);
    await this.page.getByLabel(ui.fields.taskStatus).selectOption({ label: task.status });
    if (task.executor) {
      await this.page.getByLabel(ui.fields.taskExecutor).selectOption({ label: task.executor });
    }
    if (task.labels?.length) {
      await this.page.locator('#id_labels').selectOption(
        task.labels.map((label) => ({ label })),
      );
    }
  }

  async submitCreate() {
    await this.page.getByRole('button', { name: ui.buttons.submitCreate }).click();
  }

  async submitUpdate() {
    await this.page.getByRole('button', { name: ui.buttons.submitUpdate }).click();
  }
}
