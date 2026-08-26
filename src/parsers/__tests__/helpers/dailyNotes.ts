/**
 * Doublure de `obsidian-daily-notes-interface`.
 *
 * Le paquet est publié en CommonJS et fait un `require('obsidian')` au
 * chargement : il tombe donc en dehors de l'alias posé sur `obsidian`, et le
 * seul import de `src/helpers.ts` suffirait à faire échouer toute la suite.
 * Aucun test du sérialiseur ne dépend des notes quotidiennes.
 */
export function getDailyNoteSettings(): {
  format: string;
  folder: string;
  template: string;
} {
  return { format: 'YYYY-MM-DD', folder: '', template: '' };
}

export function getDateFromFile(): null {
  return null;
}
