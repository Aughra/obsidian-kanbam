/**
 * Le numéro de brouillon porté par une carte.
 *
 * Deux sources, dans cet ordre : la clé `draft` du frontmatter de la fiche
 * liée, puis — à défaut — le nombre cité dans le texte de la carte. La seconde
 * existe parce que les cartes déjà écrites nomment le brouillon en toutes
 * lettres et qu'on ne va pas les reprendre une à une.
 */
import { CachedMetadata, TFile } from 'obsidian';
import { describe, expect, it } from 'vitest';

import { extractDraftNumber, getLinkedPageDraft, getSearchValue } from '../common';
import { astToUnhydratedBoard } from '../formats/list';
import { parseMarkdown } from '../parseMarkdown';
import { createStateManager } from './helpers/stateManager';

/** StateManager dont tout lien wiki résout vers une fiche au frontmatter donné. */
function stateManagerWithFiche(frontmatter: Record<string, unknown> | null) {
  const stateManager = createStateManager();
  const file = { path: 'fiche.md' } as TFile;

  Object.assign(stateManager.app.metadataCache, {
    getFirstLinkpathDest: () => file,
    getFileCache: () => (frontmatter ? ({ frontmatter } as CachedMetadata) : null),
  });

  return stateManager;
}

function firstCard(stateManager: ReturnType<typeof createStateManager>, cardLine: string) {
  const md = [
    '---',
    '',
    'kanban-plugin: board',
    '',
    '---',
    '',
    '## A faire',
    '',
    cardLine,
    '',
  ].join('\n');
  const { ast, settings, frontmatter } = parseMarkdown(stateManager, md);
  const board = astToUnhydratedBoard(stateManager, settings, frontmatter, ast, md);

  return board.children[0].children[0];
}

describe('numéro de brouillon dans le texte', () => {
  it('lit le nombre qui suit le mot', () => {
    expect(extractDraftNumber('[[fiche]] — draft 600 : aucun bouton file/exclusion')).toBe(600);
  });

  it('accepte « brouillon » et la forme abrégée « n° »', () => {
    expect(extractDraftNumber('le brouillon 595 en verdict review')).toBe(595);
    expect(extractDraftNumber('draft n° 42')).toBe(42);
  });

  it('exige que le mot précède le nombre', () => {
    expect(extractDraftNumber('Sprint 2')).toBeUndefined();
    expect(extractDraftNumber('Réparer la sauvegarde auto (#985)')).toBeUndefined();
  });

  it('ne prend pas « draft: true » pour un numéro', () => {
    expect(extractDraftNumber("L'article porte draft: true dans son frontmatter")).toBeUndefined();
  });

  it('ne rend rien sur un texte absent', () => {
    expect(extractDraftNumber(undefined)).toBeUndefined();
    expect(extractDraftNumber('')).toBeUndefined();
  });
});

describe('numéro de brouillon dans le frontmatter de la fiche', () => {
  const file = { path: 'fiche.md' } as TFile;

  it('lit la clé draft, en nombre comme en chaîne', () => {
    expect(getLinkedPageDraft(stateManagerWithFiche({ draft: 600 }), file)).toBe(600);
    expect(getLinkedPageDraft(stateManagerWithFiche({ draft: ' 600 ' }), file)).toBe(600);
  });

  it('ignore une valeur qui ne désigne pas un numéro', () => {
    expect(getLinkedPageDraft(stateManagerWithFiche({ draft: true }), file)).toBeUndefined();
    expect(getLinkedPageDraft(stateManagerWithFiche({ draft: 'oui' }), file)).toBeUndefined();
  });

  it('ne rend rien sans fiche ni cache', () => {
    expect(getLinkedPageDraft(stateManagerWithFiche({ draft: 600 }), null)).toBeUndefined();
    expect(getLinkedPageDraft(stateManagerWithFiche(null), file)).toBeUndefined();
  });
});

describe('numéro de brouillon porté par la carte', () => {
  it('prend celui de la fiche liée quand elle le déclare', () => {
    const card = firstCard(
      stateManagerWithFiche({ draft: 600 }),
      '- [ ] [[tortuetech-auto-agent-005]] — draft 597 : ancien numéro dans le texte'
    );

    expect(card.data.metadata.draft).toBe(600);
  });

  it('retombe sur le texte quand la fiche ne dit rien', () => {
    const card = firstCard(
      stateManagerWithFiche({ type: 'note-de-carte' }),
      '- [ ] [[tortuetech-auto-agent-005]] — draft 600 : aucun bouton quand un seul sigle'
    );

    expect(card.data.metadata.draft).toBe(600);
  });

  it('lit aussi le texte des cartes sans fiche liée', () => {
    const card = firstCard(
      createStateManager(),
      '- [ ] Faire le contrôle final du draft 593 depuis le cockpit'
    );

    expect(card.data.metadata.draft).toBe(593);
  });

  it('laisse le champ vide sur une carte qui ne parle pas de brouillon', () => {
    const card = firstCard(createStateManager(), '- [ ] Embellir le board (CSS)');

    expect(card.data.metadata.draft).toBeUndefined();
  });
});

describe('numéro de brouillon dans la recherche', () => {
  it('rend trouvable une carte dont le numéro vient de sa fiche liée', () => {
    // C'est le cas qui manquait : le texte ne cite aucun nombre, donc sans
    // cet ajout la carte ne répondait ni à « 600 » ni à « draft 600 ».
    const stateManager = stateManagerWithFiche({ draft: 600 });
    const item = firstCard(stateManager, '- [ ] [[fiche]] — le sigle qui bloque');

    expect(getSearchValue(item, stateManager)).toContain('draft 600');
  });

  it('ne cite aucun numéro sur une carte qui n’en porte pas', () => {
    const stateManager = stateManagerWithFiche(null);
    const item = firstCard(stateManager, '- [ ] une carte sans brouillon');

    expect(getSearchValue(item, stateManager)).not.toContain('draft');
  });
});
