import obsidianmd from 'eslint-plugin-obsidianmd';
import tseslint from 'typescript-eslint';

// Conformité à l'API Obsidian, en vue de la soumission au store officiel.
// Config séparée de eslint.config.mjs : celle-ci est un rapport, pas une porte
// — elle mesure une dette héritée qu'on solde par lots.
export default tseslint.config(
  {
    ignores: [
      // Tiers vendorisé : ce n'est pas notre conformité qui se joue là.
      'src/components/Editor/flatpickr/**',
      // Les tests ne sont pas livrés : ils ne passent pas la revue du store.
      'src/parsers/__tests__/**',
    ],
  },
  obsidianmd.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // no-undef ne voit pas les globales déclarées en TypeScript (src/types.d.ts,
      // le `moment` d'Obsidian) : tsc fait déjà ce travail, et mieux.
      'no-undef': 'off',

      // Famille « typage strict », héritée de typescript-eslint
      // recommended-type-checked que la config obsidianmd embarque : 1 088
      // remontées sur du code de 2021 truffé de `any`. Ce n'est pas une exigence
      // du store — c'est un chantier de typage à part entière. On les coupe ici
      // pour que check:submission mesure la conformité à l'API Obsidian, et
      // qu'il puisse atteindre zéro. À rouvrir le jour où ce chantier s'ouvre.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  }
);
