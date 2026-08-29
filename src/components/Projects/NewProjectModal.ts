import { App, Modal, Setting } from 'obsidian';
import { t } from 'src/lang/helpers';
import KanbanPlugin from 'src/main';

import { c } from '../helpers';

export class NewProjectModal extends Modal {
  plugin: KanbanPlugin;
  onCreate: () => void;
  name = '';

  constructor(app: App, plugin: KanbanPlugin, onCreate: () => void) {
    super(app);
    this.plugin = plugin;
    this.onCreate = onCreate;
  }

  onOpen() {
    const { contentEl, modalEl } = this;

    modalEl.addClass(c('new-project-modal'));
    contentEl.createEl('h2', { text: t('New project') });

    new Setting(contentEl).setName(t('Project name')).addText((text) => {
      text.inputEl.focus();
      text.onChange((value) => {
        this.name = value;
      });
      text.inputEl.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter') {
          evt.preventDefault();
          this.submit();
        }
      });
    });

    new Setting(contentEl).addButton((btn) => {
      btn
        .setButtonText(t('Create'))
        .setCta()
        .onClick(() => this.submit());
    });
  }

  async submit() {
    const name = this.name.trim();
    if (!name) return;

    this.close();
    await this.plugin.newProject(name);
    this.onCreate();
  }

  onClose() {
    this.contentEl.empty();
  }
}
