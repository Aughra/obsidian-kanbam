import { App, TFile } from 'obsidian';
import { hasFrontmatterKey } from 'src/helpers';

import { archiveString, completeString } from './common';
import { getTaskStatusDone } from './helpers/inlineMetadata';

export interface BoardSummary {
  file: TFile;
  laneCount: number;
  totalCards: number;
  doneCards: number;
}

export function getAllBoardFiles(app: App): TFile[] {
  return app.vault.getMarkdownFiles().filter((file) => hasFrontmatterKey(app, file));
}

// A lightweight, line-based stand-in for the full mdast board parser (which requires a
// live StateManager/KanbanView). Good enough for a read-only summary count; not a
// replacement for the real parser when the board is actually opened for editing.
export function summarizeBoardMarkdown(md: string, doneChar: string) {
  const lines = md.split(/\r?\n/);

  let i = 0;
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    i++;
  }

  let laneCount = 0;
  let totalCards = 0;
  let doneCards = 0;
  let inArchive = false;
  let laneAutoCompletes = false;
  let atLaneStart = false;

  for (; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('%% kanban:settings')) break;

    if (line.trim() === archiveString) {
      inArchive = true;
      continue;
    }

    if (inArchive) continue;

    if (/^##\s+/.test(line)) {
      laneCount++;
      laneAutoCompletes = false;
      atLaneStart = true;
      continue;
    }

    if (line.trim() === '') continue;

    if (atLaneStart) {
      atLaneStart = false;
      if (line.trim() === completeString) {
        laneAutoCompletes = true;
        continue;
      }
    }

    const itemMatch = line.match(/^- \[(.)\]\s/);
    if (itemMatch) {
      totalCards++;
      if (laneAutoCompletes || itemMatch[1] === doneChar) doneCards++;
    }
  }

  return { laneCount, totalCards, doneCards };
}

export async function getBoardSummary(app: App, file: TFile): Promise<BoardSummary> {
  const raw = await app.vault.cachedRead(file);
  const doneChar = getTaskStatusDone(app);
  const { laneCount, totalCards, doneCards } = summarizeBoardMarkdown(raw, doneChar);

  return { file, laneCount, totalCards, doneCards };
}
