import { describe, expect, it } from 'vitest';

import { summarizeBoardMarkdown } from '../boardSummary';

/**
 * Même board que roundtrip.test.ts (celui que le plugin écrit réellement) :
 * deux lignes vides entre colonnes, quatre avant le bloc de réglages.
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
  '- [ ] Une autre carte',
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

describe('summarizeBoardMarkdown', () => {
  it('compte les colonnes et les cartes faites/total', () => {
    expect(summarizeBoardMarkdown(board, 'x')).toEqual({
      laneCount: 3,
      totalCards: 4,
      doneCards: 1,
    });
  });

  it('compte comme faites les cartes d\'une colonne "**Complete**", quel que soit leur checkbox', () => {
    const md = board.replace('- [x] Une carte finie', '- [ ] Une carte finie');
    expect(summarizeBoardMarkdown(md, 'x')).toEqual({
      laneCount: 3,
      totalCards: 4,
      doneCards: 1,
    });
  });

  it("ignore les cartes archivées après le séparateur '***'", () => {
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

    expect(summarizeBoardMarkdown(withArchive, 'x')).toEqual({
      laneCount: 3,
      totalCards: 4,
      doneCards: 1,
    });
  });

  it('ignore le contenu du bloc de réglages', () => {
    const md = board.replace('"kanban-plugin":"board"', '"kanban-plugin":"board","x":"## Faux"');
    expect(summarizeBoardMarkdown(md, 'x')).toEqual({
      laneCount: 3,
      totalCards: 4,
      doneCards: 1,
    });
  });
});
