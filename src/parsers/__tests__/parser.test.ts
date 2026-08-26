import { laneTitleWithMaxItems } from 'src/helpers';
import { describe, expect, it } from 'vitest';

import {
  addBlockId,
  dedentNewLines,
  executeDeletion,
  indentNewLines,
  markRangeForDeletion,
  parseLaneTitle,
  removeBlockId,
  replaceBrs,
  replaceNewLines,
} from '../helpers/parser';
import { createStateManager } from './helpers/stateManager';

const stateManager = createStateManager();
const item = (blockId?: string) => ({ data: { blockId } }) as any;

describe('titres de colonne', () => {
  it('lit le compteur maximum entre parenthèses', () => {
    expect(parseLaneTitle('En cours (3)')).toEqual({ title: 'En cours', maxItems: 3 });
  });

  it("laisse le titre intact quand il n'y a pas de compteur", () => {
    expect(parseLaneTitle('En cours')).toEqual({ title: 'En cours', maxItems: 0 });
  });

  it("fait l'aller-retour avec laneTitleWithMaxItems", () => {
    for (const title of ['A faire', 'En cours (3)', 'Fait (12)']) {
      const parsed = parseLaneTitle(title);
      expect(laneTitleWithMaxItems(parsed.title, parsed.maxItems)).toBe(title);
    }
  });

  it('ne prend pas un nombre en fin de titre pour un compteur', () => {
    expect(parseLaneTitle('Sprint 2')).toEqual({ title: 'Sprint 2', maxItems: 0 });
  });
});

describe('sauts de ligne', () => {
  it('fait un aller-retour entre <br> et saut de ligne', () => {
    const multi = 'premiere ligne\nseconde ligne';

    expect(replaceNewLines(multi)).toBe('premiere ligne<br>seconde ligne');
    expect(replaceBrs(replaceNewLines(multi))).toBe(multi);
  });

  it('fait un aller-retour entre indentation et desindentation', () => {
    const multi = 'premiere ligne\nseconde ligne';

    expect(indentNewLines(stateManager.app, multi)).toBe('premiere ligne\n    seconde ligne');
    expect(dedentNewLines(indentNewLines(stateManager.app, multi))).toBe(multi);
  });
});

describe('identifiants de bloc', () => {
  it('ajoute puis retire un identifiant sans toucher au reste', () => {
    const title = 'Une carte';
    const withId = addBlockId(title, item('abc123'));

    expect(withId).toBe('Une carte ^abc123');
    expect(removeBlockId(withId)).toBe(title);
  });

  it("n'ajoute rien quand la carte n'a pas d'identifiant", () => {
    expect(addBlockId('Une carte', item())).toBe('Une carte');
  });

  it("ne pose l'identifiant que sur la premiere ligne", () => {
    expect(addBlockId('Une carte\nsuite', item('abc123'))).toBe('Une carte ^abc123\nsuite');
  });
});

describe('suppression differee', () => {
  it('marque une plage puis la retire en recollant les espaces', () => {
    const str = 'Une carte @{2026-08-26} avec une date';
    const marked = markRangeForDeletion(str, {
      start: str.indexOf('@{'),
      end: str.indexOf('}') + 1,
    });

    expect(executeDeletion(marked)).toBe('Une carte avec une date');
  });
});
