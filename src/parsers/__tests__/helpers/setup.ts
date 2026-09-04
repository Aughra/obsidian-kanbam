/**
 * Ce qu'Obsidian installe dans l'environnement avant que le greffon ne tourne.
 *
 * Deux choses que le code de `src/` tient pour acquises :
 *
 * 1. `window.localStorage` — lu dès l'import par `src/lang/helpers.ts` pour
 *    choisir la locale.
 * 2. Les extensions de prototypes d'Obsidian (`Array.first()`, `Array.last()`,
 *    `String.contains()`…). Elles sont déclarées dans `obsidian.d.ts` et
 *    ajoutées à l'exécution par Obsidian lui-même : sans elles, le sérialiseur
 *    casse dès la première carte.
 *
 * Elles sont posées en non énumérables, comme le fait Obsidian — sinon un
 * `for…in` sur un tableau se met à voir `first` et `last`.
 */
function definePrototype(target: object, name: string, value: (...args: any[]) => unknown) {
  if (name in target) return;

  Object.defineProperty(target, name, {
    value,
    enumerable: false,
    writable: true,
    configurable: true,
  });
}

definePrototype(Array.prototype, 'first', function first(this: unknown[]) {
  return this.length > 0 ? this[0] : undefined;
});

definePrototype(Array.prototype, 'last', function last(this: unknown[]) {
  return this.length > 0 ? this[this.length - 1] : undefined;
});

definePrototype(Array.prototype, 'contains', function contains(this: unknown[], target: unknown) {
  return this.includes(target);
});

definePrototype(Array.prototype, 'remove', function remove(this: unknown[], target: unknown) {
  const index = this.indexOf(target);
  if (index !== -1) this.splice(index, 1);
});

definePrototype(Array.prototype, 'unique', function unique(this: unknown[]) {
  return [...new Set(this)];
});

definePrototype(String.prototype, 'contains', function contains(this: string, target: string) {
  return this.includes(target);
});

const store = new Map<string, string>();

const localStorageStub = {
  getItem: (key: string) => (store.has(key) ? store.get(key) : null),
  setItem: (key: string, value: string): void => void store.set(key, String(value)),
  removeItem: (key: string): void => void store.delete(key),
  clear: () => store.clear(),
};

const globals = globalThis as any;

if (typeof globals.window === 'undefined') {
  globals.window = globalThis;
}

// happy-dom 20 expose bien un `window.localStorage`, mais l'objet est nu sous
// cet environnement : `getItem` n'y est pas. On teste donc la méthode qu'on
// consomme, pas la seule présence de l'objet.
if (typeof globals.window.localStorage?.getItem !== 'function') {
  Object.defineProperty(globals.window, 'localStorage', {
    value: localStorageStub,
    writable: true,
    configurable: true,
  });
}

// Le greffon esbuild `replace` réécrit setTimeout/requestAnimationFrame en
// activeWindow.* pour les fenêtres détachées d'Obsidian ; hors d'Obsidian,
// activeWindow n'existe pas.
if (typeof globals.activeWindow === 'undefined') {
  globals.activeWindow = globals.window;
}
