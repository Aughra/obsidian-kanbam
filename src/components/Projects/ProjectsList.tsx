import { App, TFile } from 'obsidian';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { kanbanViewType } from 'src/KanbanView';
import { t } from 'src/lang/helpers';
import KanbanPlugin from 'src/main';
import { BoardSummary, getAllBoardFiles, getBoardSummary } from 'src/parsers/boardSummary';

import { c } from '../helpers';
import { NewProjectModal } from './NewProjectModal';

export interface ProjectsListProps {
  app: App;
  plugin: KanbanPlugin;
}

async function loadSummaries(app: App): Promise<BoardSummary[]> {
  const files = getAllBoardFiles(app);
  const summaries = await Promise.all(files.map((file) => getBoardSummary(app, file)));

  summaries.sort((a, b) => a.file.basename.localeCompare(b.file.basename));

  return summaries;
}

export function ProjectsList({ app, plugin }: ProjectsListProps) {
  const [summaries, setSummaries] = useState<BoardSummary[] | null>(null);

  const refresh = useCallback(() => {
    loadSummaries(app).then(setSummaries);
  }, [app]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openBoard = useCallback(
    (file: TFile) => {
      app.workspace.getLeaf('tab').setViewState({
        type: kanbanViewType,
        state: { file: file.path },
      });
    },
    [app]
  );

  const createProject = useCallback(() => {
    new NewProjectModal(app, plugin, refresh).open();
  }, [app, plugin, refresh]);

  return (
    <div className={c('projects-wrapper')}>
      <div className={c('projects-header')}>
        <div className={c('projects-title')}>
          {t('Projects')}
          {summaries && <span className={c('projects-count')}>{summaries.length}</span>}
        </div>
        <button className={c('projects-new-button')} onClick={createProject}>
          {t('New project')}
        </button>
      </div>

      {summaries === null ? (
        <div className={c('projects-empty')}>{t('Loading projects...')}</div>
      ) : summaries.length === 0 ? (
        <div className={c('projects-empty')}>{t('No projects yet')}</div>
      ) : (
        <table className={c('projects-table')}>
          <thead>
            <tr>
              <th>{t('Project')}</th>
              <th>{t('Columns')}</th>
              <th>{t('Cards')}</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => (
              <tr key={s.file.path} onClick={() => openBoard(s.file)}>
                <td>{s.file.basename}</td>
                <td>{s.laneCount}</td>
                <td>
                  {s.doneCards}/{s.totalCards}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
