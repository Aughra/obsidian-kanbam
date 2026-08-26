import { describe, expect, it } from 'vitest';

import { astToUnhydratedBoard, boardToMd } from '../formats/list';
import { parseMarkdown } from '../parseMarkdown';
import { createStateManager } from './helpers/stateManager';

const stateManager = createStateManager();

function mdToBoard(md: string) {
  const { ast, settings, frontmatter } = parseMarkdown(stateManager, md);
  return astToUnhydratedBoard(stateManager, settings, frontmatter, ast, md);
}

function roundtrip(md: string) {
  return boardToMd(stateManager, mdToBoard(md));
}

/**
 * Un board écrit exactement comme le plugin l'écrit — lignes vides comprises,
 * puisque c'est ce que l'aller-retour doit rendre au caractère près :
 * deux lignes vides entre deux colonnes, quatre avant le bloc de réglages.
 */
const board = [
  '---',
  '',
  'kanban-plugin: board',
  '',
  '---',
  '',
  '## A faire',
  '',
  '- [ ] Une carte simple',
  '- [ ] Une carte avec un tag #projet',
  '- [ ] Une carte avec un lien [[Une note]]',
  '- [ ] Une carte avec un identifiant ^abc123',
  '',
  '',
  '## En cours (3)',
  '',
  '- [ ] Une carte en cours',
  '',
  '',
  '## Fait',
  '',
  '**Complete**',
  '- [x] Une carte finie',
  '',
  '',
  '',
  '',
  '%% kanban:settings',
  '```',
  '{"kanban-plugin":"board"}',
  '```',
  '%%',
].join('\n');

describe('aller-retour markdown -> board -> markdown', () => {
  it('rend le document intact', () => {
    expect(roundtrip(board)).toBe(board);
  });

  it('est idempotent au second passage', () => {
    const once = roundtrip(board);
    expect(roundtrip(once)).toBe(once);
  });

  it('conserve les colonnes, leur titre et leur compteur', () => {
    const parsed = mdToBoard(board);

    expect(parsed.children.map((lane) => lane.data.title)).toEqual(['A faire', 'En cours', 'Fait']);
    expect(parsed.children.map((lane) => lane.data.maxItems)).toEqual([0, 3, 0]);
    expect(parsed.children.map((lane) => lane.data.shouldMarkItemsComplete)).toEqual([
      false,
      false,
      true,
    ]);
  });

  it('conserve le texte brut des cartes et leur marqueur de statut', () => {
    const parsed = mdToBoard(board);

    expect(parsed.children[0].children.map((item) => item.data.titleRaw)).toEqual([
      'Une carte simple',
      'Une carte avec un tag #projet',
      'Une carte avec un lien [[Une note]]',
      'Une carte avec un identifiant',
    ]);
    expect(parsed.children[0].children[3].data.blockId).toBe('abc123');
    expect(parsed.children[2].children[0].data.checkChar).toBe('x');
  });

  it('conserve les réglages du bloc de code de pied de page', () => {
    expect(mdToBoard(board).data.settings).toEqual({ 'kanban-plugin': 'board' });
  });

  it('conserve le frontmatter propre au fichier', () => {
    const withFrontmatter = board.replace(
      'kanban-plugin: board',
      'kanban-plugin: board\nauteur: eliore'
    );

    expect(roundtrip(withFrontmatter)).toBe(withFrontmatter);
    expect(mdToBoard(withFrontmatter).data.frontmatter).toEqual({
      'kanban-plugin': 'board',
      auteur: 'eliore',
    });
  });
});

describe('archive', () => {
  const withArchive = board.replace(
    ['- [x] Une carte finie', '', '', '', '', '%% kanban:settings'].join('\n'),
    [
      '- [x] Une carte finie',
      '',
      '',
      '***',
      '',
      '## Archive',
      '',
      '- [ ] Une carte archivée',
      '',
      '%% kanban:settings',
    ].join('\n')
  );

  it('fait un aller-retour intact', () => {
    expect(roundtrip(withArchive)).toBe(withArchive);
  });

  it('range les cartes archivées hors des colonnes', () => {
    const parsed = mdToBoard(withArchive);

    expect(parsed.children).toHaveLength(3);
    expect(parsed.data.archive.map((item) => item.data.titleRaw)).toEqual(['Une carte archivée']);
  });
});

describe('cartes sur plusieurs lignes', () => {
  // La continuation est réindentée de quatre espaces à l'écriture
  // (indentNewLines), et redressée à la lecture (dedentNewLines).
  const multiline = board.replace(
    '- [ ] Une carte simple',
    ['- [ ] Une carte sur', '    plusieurs lignes'].join('\n')
  );

  it('fait un aller-retour intact', () => {
    expect(roundtrip(multiline)).toBe(multiline);
  });

  it('recolle les lignes dans le texte brut de la carte', () => {
    expect(mdToBoard(multiline).children[0].children[0].data.titleRaw).toBe(
      'Une carte sur\nplusieurs lignes'
    );
  });
});
