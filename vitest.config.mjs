import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    // Les 129 imports en `from 'src/…'` sont résolus par le baseUrl du tsconfig,
    // que Vite ne lit pas de lui-même. Natif depuis Vite 8 : plus besoin du
    // greffon vite-tsconfig-paths.
    tsconfigPaths: true,
    alias: {
      // L'API Obsidian n'existe qu'à l'intérieur d'Obsidian : les tests tapent
      // dans une doublure qui n'implémente que ce que src/parsers/ consomme.
      obsidian: fromRoot('./src/parsers/__tests__/helpers/obsidian.ts'),
      // Ces deux-là sont publiés en CommonJS et font un `require('obsidian')`
      // au chargement : ils échappent à l'alias ci-dessus et doivent être
      // doublés à leur tour.
      'obsidian-daily-notes-interface': fromRoot('./src/parsers/__tests__/helpers/dailyNotes.ts'),
      'obsidian-dataview': fromRoot('./src/parsers/__tests__/helpers/dataview.ts'),
      // Même alias qu'en production (package.json + paths du tsconfig), que Vite
      // ne reprend pas depuis le `npm:@preact/compat` du package.json.
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  test: {
    // Le périmètre du filet : le sérialiseur markdown↔board, rien d'autre pour
    // l'instant.
    include: ['src/parsers/**/*.test.ts'],
    // Le graphe d'imports du parseur atteint src/Settings.ts (pour
    // settingKeyLookup), qui tire settingHelpers.ts, qui tire choices.js —
    // lequel touche `document` dès son chargement. Obsidian tourne dans un DOM
    // de toute façon : on en donne un, plutôt que de simuler pièce par pièce.
    environment: 'happy-dom',
    setupFiles: [fromRoot('./src/parsers/__tests__/helpers/setup.ts')],
    coverage: {
      provider: 'v8',
      include: ['src/parsers/**/*.ts'],
      exclude: ['src/parsers/__tests__/**'],
    },
  },
});
