/**
 * StateManager factice, réduit à la surface que `src/parsers/` consomme.
 *
 * Le vrai StateManager a besoin d'une KanbanView, donc d'une fenêtre Obsidian.
 * Les fonctions du sérialiseur, elles, ne lui demandent que des réglages, un
 * chemin de fichier et deux ou trois accès au vault.
 */
import { CachedMetadata, TFile } from 'obsidian';
import { KanbanSettings } from 'src/Settings';
import { StateManager } from 'src/StateManager';

export const testSettings: KanbanSettings = {
  'kanban-plugin': 'board',
  'date-trigger': '@',
  'time-trigger': '@@',
  'date-format': 'YYYY-MM-DD',
  'time-format': 'HH:mm',
  'date-display-format': 'YYYY-MM-DD',
  'inline-metadata-position': 'body',
  'move-dates': false,
  'move-tags': false,
  'move-task-metadata': false,
  'metadata-keys': [],
  'date-colors': [],
};

export function createStateManager(overrides: Partial<KanbanSettings> = {}): StateManager {
  const settings: KanbanSettings = { ...testSettings, ...overrides };

  const stateManager = {
    app: {
      // Lu par indentNewLines() pour choisir tabulation ou espaces.
      vault: { getConfig: () => false },
      // Aucun lien wiki ne résout : les tests ne dépendent pas d'un vault.
      metadataCache: {
        getFirstLinkpathDest: (): TFile => null,
        getFileCache: (): CachedMetadata => null,
      },
      // Consulté par getDataviewPlugin() : aucun greffon tiers en test.
      plugins: { enabledPlugins: new Set<string>(), plugins: {} },
      internalPlugins: { plugins: {} },
    },
    file: { path: 'Kanbam.md' },
    state: null as unknown,
    getSetting: (key: keyof KanbanSettings) => settings[key],
    getSettingRaw: (key: keyof KanbanSettings) => settings[key],
    compileSettings: () => {},
    hasError: () => false,
    setError: (e: Error) => {
      // Un test ne doit jamais avaler une erreur du parseur en silence.
      throw e;
    },
  };

  return stateManager as unknown as StateManager;
}
