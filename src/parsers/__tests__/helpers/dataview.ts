/**
 * Doublure de `obsidian-dataview`.
 *
 * Même raison que dailyNotes.ts : paquet CommonJS qui fait un
 * `require('obsidian')` au chargement, donc hors de portée de l'alias.
 *
 * `getAPI()` rend `undefined` quand le greffon Dataview n'est pas installé —
 * c'est le cas nominal côté code appelant (`const dv = getAPI(); if (dv) …`),
 * et c'est ce que les tests simulent.
 */
export function getAPI(): undefined {
  return undefined;
}
