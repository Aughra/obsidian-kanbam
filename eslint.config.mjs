import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Config de développement — celle qui doit rester verte (`yarn check:code`).
// La conformité à l'API Obsidian est mesurée à part, par
// `eslint.submission.config.mjs` (`yarn check:submission`).
export default tseslint.config(
  {
    // Tiers vendorisé dans src/ : gardé tel que l'amont le publie, comme pour
    // prettier (.prettierignore) et tsc (exclude du tsconfig).
    ignores: ['src/components/Editor/flatpickr/**'],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        // Mode type-aware : tout fichier linté doit être dans l'include du
        // tsconfig, fichiers de test compris.
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      // react est un alias vers preact/compat (package.json + paths du tsconfig).
      react: { version: '18.0' },
    },
    rules: {
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'linebreak-style': ['error', 'unix'],
      indent: 'off',
      quotes: 'off',
    },
  }
);
