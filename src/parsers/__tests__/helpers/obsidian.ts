/**
 * Doublure du module `obsidian` pour les tests.
 *
 * L'API d'Obsidian n'existe qu'à l'intérieur d'Obsidian : en test, `obsidian`
 * est aliasé vers ce fichier (voir vitest.config.mjs).
 *
 * Le graphe d'imports de `src/parsers/` atteint les composants Preact, donc
 * tous les noms importés depuis `obsidian` quelque part dans `src/` doivent
 * exister ici — au moins comme coquille, le temps que les modules se chargent.
 * Seuls `parseYaml`, `stringifyYaml` et `moment` ont un vrai comportement :
 * ce sont les seuls que le sérialiseur appelle réellement.
 *
 * `parseYaml`/`stringifyYaml` sont volontairement simulés plutôt que délégués à
 * une bibliothèque YAML : un second analyseur ferait diverger les tests de la
 * façon dont Obsidian lit le frontmatter en production. La simulation couvre
 * les tables plates (`clé: valeur`) et les listes simples — assez pour un
 * frontmatter de board, pas plus. Un test qui aurait besoin de YAML imbriqué
 * doit d'abord étendre ces deux fonctions, sciemment.
 */
import realMoment from 'moment';

export const moment = realMoment;

function parseScalar(raw: string): unknown {
  const value = raw.trim();

  if (value === '' || value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (/^"(.*)"$/.test(value) || /^'(.*)'$/.test(value)) return value.slice(1, -1);

  return value;
}

function formatScalar(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  return String(value);
}

export function parseYaml(str: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  let listKey: string | null = null;

  for (const line of str.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;

    const listItem = /^\s+-\s+(.*)$/.exec(line);
    if (listItem && listKey !== null) {
      (out[listKey] as unknown[]).push(parseScalar(listItem[1]));
      continue;
    }

    const entry = /^([^:\s][^:]*):(.*)$/.exec(line);
    if (!entry) continue;

    const [, key, rest] = entry;

    if (rest.trim() === '') {
      // Une clé sans valeur : liste si des `- …` suivent, null sinon.
      out[key] = [];
      listKey = key;
    } else {
      out[key] = parseScalar(rest);
      listKey = null;
    }
  }

  for (const [key, value] of Object.entries(out)) {
    if (Array.isArray(value) && value.length === 0) out[key] = null;
  }

  return out;
}

export function stringifyYaml(obj: unknown): string {
  if (obj === null || obj === undefined) return 'null\n';

  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return '{}\n';

  return entries
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return `${key}: []\n`;
        return `${key}:\n` + value.map((item) => `  - ${formatScalar(item)}\n`).join('');
      }
      return `${key}: ${formatScalar(value)}\n`;
    })
    .join('');
}

export function getLinkpath(linktext: string): string {
  return linktext;
}

export function parseLinktext(linktext: string): { path: string; subpath: string } {
  const [path, subpath = ''] = linktext.split('#');
  return { path, subpath };
}

export function htmlToMarkdown(html: string): string {
  return html;
}

export function setIcon(): void {}

export function debounce<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

/* -- Coquilles : présentes pour que les modules se chargent, rien de plus. -- */

export class App {
  vault: Vault;
  workspace: any;
  metadataCache: any;
}

export class Vault {}

export class Component {
  load() {}
  unload() {}
  onload() {}
  onunload() {}
  register() {}
  registerEvent() {}
  registerDomEvent() {}
  addChild<T>(child: T): T {
    return child;
  }
}

export class TFile {
  path = '';
  name = '';
  basename = '';
  extension = 'md';
  stat: Stat = { ctime: 0, mtime: 0, size: 0 };
  parent: TFolder = null;
  vault: Vault = null;
}

export class TFolder {
  path = '';
  name = '';
  children: unknown[] = [];
}

export class WorkspaceLeaf extends Component {}

export class TextFileView extends Component {
  file: TFile = null;
  data = '';
  containerEl: any;
  constructor(public leaf?: WorkspaceLeaf) {
    super();
  }
}

export class MarkdownView extends TextFileView {}

export class Editor {}

export class EditorSuggest<T> extends Component {
  constructor(public app?: App) {
    super();
  }
  onTrigger(): EditorSuggestTriggerInfo {
    return null;
  }
  getSuggestions(): T[] {
    return [] as T[];
  }
}

export class Plugin extends Component {
  constructor(
    public app?: App,
    public manifest?: unknown
  ) {
    super();
  }
  addCommand() {}
  addSettingTab() {}
  registerView() {}
  registerEvent() {}
  loadData() {
    return Promise.resolve({});
  }
  saveData() {
    return Promise.resolve();
  }
}

export class PluginSettingTab {
  containerEl: any;
  constructor(
    public app?: App,
    public plugin?: Plugin
  ) {}
  display() {}
  hide() {}
}

export class Modal {
  containerEl: any;
  contentEl: any;
  constructor(public app?: App) {}
  open() {}
  close() {}
}

export class Notice {
  constructor(public message?: string) {}
  hide() {}
}

export class Menu {
  addItem() {
    return this;
  }
  addSeparator() {
    return this;
  }
  showAtMouseEvent() {
    return this;
  }
  showAtPosition() {
    return this;
  }
}

export class Setting {
  constructor(public containerEl?: unknown) {}
  setName() {
    return this;
  }
  setDesc() {
    return this;
  }
  addText() {
    return this;
  }
  addToggle() {
    return this;
  }
  addDropdown() {
    return this;
  }
}

export class DropdownComponent {
  constructor(public containerEl?: unknown) {}
}

export class ToggleComponent {
  constructor(public containerEl?: unknown) {}
}

export class HoverPopover {}

export class MarkdownRenderer extends Component {
  static render() {
    return Promise.resolve();
  }
  static renderMarkdown() {
    return Promise.resolve();
  }
}

export class Keymap {
  static isModEvent() {
    return false;
  }
  static isModifier() {
    return false;
  }
}

export const Platform = {
  isMobile: false,
  isDesktop: true,
  isDesktopApp: true,
  isMobileApp: false,
  isPhone: false,
  isTablet: false,
};

/* -- Types seuls : élidés à la compilation, jamais lus à l'exécution. -- */

export type Stat = { ctime: number; mtime: number; size: number };
export type EditorPosition = { line: number; ch: number };
export type EditorSuggestContext = any;
export type EditorSuggestTriggerInfo = any;
export type HoverParent = any;
export type ViewState = { type: string; state?: Record<string, unknown>; [key: string]: any };
export type ViewStateResult = any;
