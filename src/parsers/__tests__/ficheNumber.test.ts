/**
 * Le numéro de fiche porté par une carte, et le préfixe « [catégorie] »
 * retiré de son affichage.
 *
 * Deux sources pour le numéro, dans cet ordre : la cible du lien wiki qui
 * porte la carte (`[[tortuetech-auto-agent-013 titre…]]`), puis — à défaut —
 * le texte brut de la carte. Le préfixe entre crochets, lui, n'est qu'une
 * convention d'écriture sur le tableau : il disparaît de l'affichage sans
 * toucher au lien ni au numéro qu'il précède.
 */
import { CachedMetadata, TFile } from 'obsidian';
import { describe, expect, it } from 'vitest';

import { extractFicheNumber, stripLeadingBracketPrefix } from '../common';
import { astToUnhydratedBoard } from '../formats/list';
import { parseMarkdown } from '../parseMarkdown';
import { createStateManager } from './helpers/stateManager';

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

describe('numéro de fiche dans le texte', () => {
  it('lit le numéro <projet>-<domaine>-NNN', () => {
    expect(extractFicheNumber('tortuetech-auto-agent-013 trois collections RAG sur quatre')).toBe(
      'tortuetech-auto-agent-013'
    );
  });

  it('lit aussi la forme à deux segments <projet>-NNN', () => {
    expect(extractFicheNumber('aya-shell-001 trois alias morts')).toBe('aya-shell-001');
  });

  it('ne rend rien sur un texte sans numéro de fiche', () => {
    expect(extractFicheNumber('Sprint 2')).toBeUndefined();
    expect(extractFicheNumber(undefined)).toBeUndefined();
    expect(extractFicheNumber('')).toBeUndefined();
  });
});

describe('préfixe [catégorie] retiré de l’affichage', () => {
  it('retire un préfixe entre crochets en tête de texte', () => {
    expect(stripLeadingBracketPrefix('[auto-agent] la suite du titre')).toBe('la suite du titre');
    expect(stripLeadingBracketPrefix('[ui] tortuetech-ui-014 numero attribue deux fois')).toBe(
      'tortuetech-ui-014 numero attribue deux fois'
    );
  });

  it('laisse un [[lien wiki]] en tête intact', () => {
    const text = '[[tortuetech-auto-agent-013 trois collections RAG]]';
    expect(stripLeadingBracketPrefix(text)).toBe(text);
  });

  it('laisse un texte sans préfixe intact', () => {
    expect(stripLeadingBracketPrefix('rien à retirer ici')).toBe('rien à retirer ici');
  });
});

describe('numéro de fiche porté par la carte', () => {
  it('prend celui de la cible du lien wiki', () => {
    const card = firstCard(
      stateManagerWithFiche({ type: 'note-de-carte' }),
      '- [ ] [auto-agent] [[tortuetech-auto-agent-013 trois collections RAG sur quatre jamais remplies]]'
    );

    expect(card.data.metadata.ficheNumber).toBe('tortuetech-auto-agent-013');
  });

  it('retombe sur le texte brut sans lien résolu', () => {
    const card = firstCard(
      createStateManager(),
      '- [ ] [ui] tortuetech-ui-014 numero ui-012 attribue'
    );

    expect(card.data.metadata.ficheNumber).toBe('tortuetech-ui-014');
  });

  it('laisse le champ vide sur une carte qui ne cite aucune fiche', () => {
    const card = firstCard(createStateManager(), '- [ ] Embellir le board (CSS)');

    expect(card.data.metadata.ficheNumber).toBeUndefined();
  });

  it('retire le préfixe [catégorie] du titre affiché mais garde le lien', () => {
    const card = firstCard(
      stateManagerWithFiche({ type: 'note-de-carte' }),
      '- [ ] [auto-agent] [[tortuetech-auto-agent-013 trois collections RAG sur quatre jamais remplies]]'
    );

    expect(card.data.title).not.toContain('[auto-agent]');
    expect(card.data.title).toContain('tortuetech-auto-agent-013');
    // La donnée brute — celle qu'on réécrit sur disque — garde le préfixe :
    // seul l'affichage change.
    expect(card.data.titleRaw).toContain('[auto-agent]');
  });
});
