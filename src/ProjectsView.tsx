import { ItemView, WorkspaceLeaf } from 'obsidian';
import { render, unmountComponentAtNode } from 'preact/compat';

import { ProjectsList } from './components/Projects/ProjectsList';
import { t } from './lang/helpers';
import KanbanPlugin from './main';

export const projectsViewType = 'kanbam-projects';
export const projectsIcon = 'lucide-layout-grid';

export class ProjectsView extends ItemView {
  plugin: KanbanPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: KanbanPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return projectsViewType;
  }

  getIcon() {
    return projectsIcon;
  }

  getDisplayText() {
    return t('Projects');
  }

  async onOpen() {
    this.contentEl.addClass('kanban-plugin__projects-view');
    render(<ProjectsList app={this.app} plugin={this.plugin} />, this.contentEl);
  }

  async onClose() {
    unmountComponentAtNode(this.contentEl);
  }
}
