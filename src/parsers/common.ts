import { App, TFile, moment } from 'obsidian';
import { KanbanSettings } from 'src/Settings';
import { StateManager } from 'src/StateManager';
import { anyToString } from 'src/components/Item/MetadataTable';
import { Board, FileMetadata, Item } from 'src/components/types';
import { defaultSort } from 'src/helpers/util';
import { t } from 'src/lang/helpers';

export const frontmatterKey = 'kanban-plugin';

export enum ParserFormats {
  List,
}

export interface BaseFormat {
  newItem(content: string, checkChar: string, forceEdit?: boolean): Item;
  updateItemContent(item: Item, content: string): Item;
  boardToMd(board: Board): string;
  mdToBoard(md: string): Board;
  reparseBoard(): Board;
}

export const completeString = `**${t('Complete')}**`;
export const archiveString = '***';
export const basicFrontmatter = ['---', '', `${frontmatterKey}: board`, '', '---', '', ''].join(
  '\n'
);

export function settingsToCodeblock(board: Board): string {
  return [
    '',
    '',
    '%% kanban:settings',
    '```',
    JSON.stringify(board.data.settings),
    '```',
    '%%',
  ].join('\n');
}

export function getSearchValue(item: Item, stateManager: StateManager) {
  const fileMetadata = item.data.metadata.fileMetadata;
  const { titleSearchRaw } = item.data;

  const searchValue = [titleSearchRaw];

  // Le numéro de brouillon. Sans lui, une carte qui le tient de sa fiche liée
  // (et non de son texte) est introuvable en cherchant « 600 » : getSearchValue
  // ne voit que le titre et les clés du réglage « metadata-keys », or ce numéro
  // se lit hors de ce réglage, exprès. Poussé avec son mot pour que « draft 600 »
  // trouve aussi bien que « 600 ».
  if (item.data.metadata.draft !== undefined) {
    searchValue.push(`draft ${item.data.metadata.draft}`);
  }

  if (fileMetadata) {
    const presentKeys = Object.keys(fileMetadata).filter((k) => {
      return item.data.metadata.fileMetadataOrder?.includes(k);
    });
    if (presentKeys.length) {
      const keys = anyToString(presentKeys, stateManager);
      const values = anyToString(
        presentKeys.map((k) => fileMetadata[k]),
        stateManager
      );

      if (keys) searchValue.push(keys);
      if (values) searchValue.push(values);
    }
  }

  if (item.data.metadata.time) {
    searchValue.push(item.data.metadata.time.format('LLLL'));
    searchValue.push(anyToString(item.data.metadata.time, stateManager));
  } else if (item.data.metadata.date) {
    searchValue.push(item.data.metadata.date.format('LLLL'));
    searchValue.push(anyToString(item.data.metadata.date, stateManager));
  }

  return searchValue.join(' ').toLocaleLowerCase();
}

export function getDataViewCache(app: App, linkedFile: TFile, sourceFile: TFile) {
  if (
    (app as any).plugins.enabledPlugins.has('dataview') &&
    (app as any).plugins?.plugins?.dataview?.api
  ) {
    return (app as any).plugins.plugins.dataview.api.page(linkedFile.path, sourceFile.path);
  }
}

function getPageData(obj: any, path: string) {
  if (!obj) return null;
  if (obj[path]) return obj[path];

  const split = path.split('.');
  let ctx = obj;

  for (const p of split) {
    if (typeof ctx === 'object' && p in ctx) {
      ctx = ctx[p];
    } else {
      ctx = null;
      break;
    }
  }

  return ctx;
}

export function getLinkedPageMetadata(
  stateManager: StateManager,
  linkedFile: TFile | null | undefined
): { fileMetadata?: FileMetadata; fileMetadataOrder?: string[] } {
  const metaKeys = stateManager.getSetting('metadata-keys');

  if (!metaKeys.length) {
    return {};
  }

  if (!linkedFile) {
    return {};
  }

  const cache = stateManager.app.metadataCache.getFileCache(linkedFile);
  const dataviewCache = getDataViewCache(stateManager.app, linkedFile, stateManager.file);

  if (!cache && !dataviewCache) {
    return {};
  }

  const metadata: FileMetadata = {};
  const seenTags: { [k: string]: boolean } = {};
  const seenKey: { [k: string]: boolean } = {};
  const order: string[] = [];

  let haveData = false;

  metaKeys.forEach((k) => {
    if (seenKey[k.metadataKey]) return;

    seenKey[k.metadataKey] = true;

    if (k.metadataKey === 'tags') {
      let tags = cache?.tags || [];

      if (Array.isArray(cache?.frontmatter?.tags)) {
        tags = [].concat(
          tags,
          cache.frontmatter.tags.map((tag: string) => ({ tag: `#${tag}` }))
        );
      }

      if (tags?.length === 0) return;

      order.push(k.metadataKey);
      metadata.tags = {
        ...k,
        value: tags
          .map((t) => t.tag)
          .filter((t) => {
            if (seenTags[t]) {
              return false;
            }

            seenTags[t] = true;
            return true;
          })
          .sort(defaultSort),
      };

      haveData = true;
      return;
    }

    const dataviewVal = getPageData(dataviewCache, k.metadataKey);
    let cacheVal = getPageData(cache?.frontmatter, k.metadataKey);
    if (
      cacheVal !== null &&
      cacheVal !== undefined &&
      cacheVal !== '' &&
      !(Array.isArray(cacheVal) && cacheVal.length === 0)
    ) {
      if (typeof cacheVal === 'string') {
        if (/^\d{4}-\d{2}-\d{2}/.test(cacheVal)) {
          cacheVal = moment(cacheVal);
        } else if (/^\[\[[^\]]+\]\]$/.test(cacheVal)) {
          const link = (cache.frontmatterLinks || []).find((l) => l.key === k.metadataKey);
          if (link) {
            const file = stateManager.app.metadataCache.getFirstLinkpathDest(
              link.link,
              stateManager.file.path
            );
            if (file) {
              cacheVal = file;
            }
          }
        }
      } else if (Array.isArray(cacheVal)) {
        cacheVal = cacheVal.map<any>((v, i) => {
          if (typeof v === 'string' && /^\[\[[^\]]+\]\]$/.test(v)) {
            const link = (cache.frontmatterLinks || []).find(
              (l) => l.key === k.metadataKey + '.' + i.toString()
            );
            if (link) {
              const file = stateManager.app.metadataCache.getFirstLinkpathDest(
                link.link,
                stateManager.file.path
              );
              if (file) {
                return file;
              }
            }
          }
          return v;
        });
      }

      order.push(k.metadataKey);
      metadata[k.metadataKey] = {
        ...k,
        value: cacheVal,
      };
      haveData = true;
    } else if (
      dataviewVal !== undefined &&
      dataviewVal !== null &&
      dataviewVal !== '' &&
      !(Array.isArray(dataviewVal) && dataviewVal.length === 0)
    ) {
      const cachedValue = dataviewCache[k.metadataKey];

      order.push(k.metadataKey);
      metadata[k.metadataKey] = {
        ...k,
        value: cachedValue,
      };
      haveData = true;
    }
  });

  return {
    fileMetadata: haveData ? metadata : undefined,
    fileMetadataOrder: order,
  };
}

// Le mot doit précéder le nombre, d'où l'absence d'alternative « nombre seul » :
// « Sprint 2 », « (#985) » et « draft: true » ne doivent rien produire.
const draftInText = /\b(?:drafts?|brouillons?)\s*(?:n[°o]\s*)?(\d{1,6})\b/i;

/**
 * Numéro de brouillon nommé dans le texte d'une carte.
 *
 * Les cartes de suivi éditorial citent le brouillon en toutes lettres
 * (« — draft 600 : aucun bouton… », « le brouillon 595 en verdict review »).
 * C'est l'identifiant qu'on redonne ensuite au cockpit ou à l'agent : on
 * l'extrait pour l'afficher à part, au lieu de le laisser au milieu d'une
 * phrase où il faut aller le chercher.
 */
export function extractDraftNumber(text: string | null | undefined): number | undefined {
  const match = text?.match(draftInText);
  return match ? Number(match[1]) : undefined;
}

/**
 * Numéro de brouillon porté par le frontmatter de la fiche liée (clé `draft`).
 *
 * Prioritaire sur le texte de la carte : quand la fiche le déclare, c'est une
 * donnée, pas une tournure de phrase. Volontairement lu hors de
 * `getLinkedPageMetadata` — celui-ci ne rend que les clés listées dans le
 * réglage « metadata-keys » et rend main vide quand la liste l'est, alors que
 * ce numéro doit s'afficher sans réglage préalable.
 *
 * Une valeur non numérique (`draft: true`, courant dans les frontmatters de
 * publication) ne donne rien : c'est un autre sens du mot.
 */
export function getLinkedPageDraft(
  stateManager: StateManager,
  linkedFile: TFile | null | undefined
): number | undefined {
  if (!linkedFile) return undefined;

  const raw = stateManager.app.metadataCache.getFileCache(linkedFile)?.frontmatter?.draft;

  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : undefined;
  if (typeof raw !== 'string') return undefined;

  const trimmed = raw.trim();

  return /^\d{1,6}$/.test(trimmed) ? Number(trimmed) : undefined;
}

// `<projet>-<domaine>-NNN` (p. ex. « tortuetech-auto-agent-013 ») ou, plus
// rarement, `<projet>-NNN` (p. ex. « aya-shell-001 » compte comme domaine
// unique). Le numéro est toujours en toutes fin de segment, sur 1 à 6
// chiffres, précédé d'un tiret — ce qui exclut une année ou un nombre isolé
// ailleurs dans le titre.
const ficheNumber = /\b([a-z][a-z0-9]*(?:-[a-z0-9]+)+-\d{1,6})\b/i;

/**
 * Numéro de fiche porté par une carte (« tortuetech-auto-agent-013 »,
 * « aya-shell-001 »…).
 *
 * Les tableaux Kanbam nomment la fiche en tête de carte, dans la cible du
 * lien wiki qui la porte (`[[tortuetech-auto-agent-013 titre…]]`). On le lit
 * en priorité là — c'est la donnée, pas une tournure de phrase — et on
 * retombe sur le texte brut de la carte pour les cartes sans lien résolu.
 */
export function extractFicheNumber(text: string | null | undefined): string | undefined {
  const match = text?.match(ficheNumber);
  return match ? match[1] : undefined;
}

// `[^\[\]]+` exclut le `[[…]]` d'un lien wiki : celui-ci ouvre par un second
// crochet, jamais capté ici.
const leadingBracketPrefix = /^\[[^[\]]+\]\s*/;

/**
 * Retire le préfixe `[catégorie]` en tête de carte (« [auto-agent] »,
 * « [ui] »…), posé par convention dans les tableaux Kanbam pour marquer la
 * colonne logique du projet agrégateur.
 *
 * Affichage seulement : la donnée qu'il porte reste ailleurs (le lien vers la
 * fiche, dont le numéro nomme déjà le domaine) — ce n'est pas un tag Obsidian,
 * rien à faire disparaître côté filtrage.
 */
export function stripLeadingBracketPrefix(text: string): string {
  return text.replace(leadingBracketPrefix, '');
}

export function shouldRefreshBoard(oldSettings: KanbanSettings, newSettings: KanbanSettings) {
  if (!oldSettings && newSettings) {
    return true;
  }

  const toCompare: Array<keyof KanbanSettings> = [
    'metadata-keys',
    'date-trigger',
    'time-trigger',
    'link-date-to-daily-note',
    'date-format',
    'time-format',
    'move-dates',
    'move-tags',
    'inline-metadata-position',
    'move-task-metadata',
    'hide-card-count',
    'tag-colors',
    'date-colors',
  ];

  return !toCompare.every((k) => {
    return oldSettings[k] === newSettings[k];
  });
}
