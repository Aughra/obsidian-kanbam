# Obsidian Kanban Plugin

**The Kanban plugin is looking for new maintainers.** Interested? [Read more here.](https://github.com/mgmeyers/obsidian-kanban/blob/main/MAINTAINERS.md)

---

This is a fork of [obsidian-kanban](https://github.com/community-archive/obsidian-kanban) by mgmeyers (community-archive). Modifications © 2026 Aughra, licensed GPL-3.0 (see [LICENSE.md](LICENSE.md)), same as the original.

---

Create markdown-backed Kanban boards in [Obsidian](https://obsidian.md/)

- [Bugs, Issues, & Feature Requests](https://github.com/mgmeyers/obsidian-kanban/issues)
- [Development Roadmap](https://github.com/mgmeyers/obsidian-kanban/projects/1)

![Screen Shot 2021-09-16 at 12.58.22 PM.png](https://github.com/mgmeyers/obsidian-kanban/blob/main/docs/Assets/Screen%20Shot%202021-09-16%20at%2012.58.22%20PM.png)

![Screen Shot 2021-09-16 at 1.10.38 PM.png](https://github.com/mgmeyers/obsidian-kanban/blob/main/docs/Assets/Screen%20Shot%202021-09-16%20at%201.10.38%20PM.png)

## Documentation

Find the plugin documentation here: [Obsidian Kanban Plugin Documentation](https://publish.obsidian.md/kanban/)

## Development

All install/build/typecheck commands run inside the provided Docker container — nothing is installed globally on the host.

```sh
docker compose build                        # build the dev image (Node 24 + yarn 1)
docker compose run --rm dev yarn install    # install dependencies (into a named volume)
docker compose run --rm dev yarn build      # build main.js / styles.css
docker compose run --rm dev yarn check-all  # types + lint + format
docker compose run --rm dev yarn test       # unit tests (vitest)
```

`check-all` runs `check:types` (tsc), `check:code` (eslint) and
`check:format` (prettier). Their `fix:*` counterparts apply what can be
applied automatically; `fix` runs both. The aggregate is *not* named
`check`: `yarn check` is a built-in yarn 1 command that verifies
`node_modules` and exits 0 without ever running the script — a green
result that means nothing.

```sh
docker compose run --rm dev yarn fix        # format + autofixable lint
```

### Tests

`vitest` covers `src/parsers/` — the markdown ↔ board serializer. The
invariant under test is that `markdown → board → markdown` is the identity:
the plugin rewrites the user's own notes, so anything the serializer drops
is data loss.

```sh
docker compose run --rm dev yarn test           # one run
docker compose run --rm dev yarn test:coverage  # with coverage
```

Tests live in `src/parsers/__tests__/`, inside the tsconfig `include` on
purpose: ESLint runs type-aware and refuses any file outside the project.
Keep new test files under `src/`. `helpers/obsidian.ts` stands in for the
Obsidian API, and `helpers/setup.ts` installs what Obsidian adds to the
runtime (`Array.first()`, `String.contains()`, `window.localStorage`).

### Store conformance

```sh
docker compose run --rm dev yarn check:submission
```

Runs `eslint-plugin-obsidianmd` (`eslint.submission.config.mjs`) against the
Obsidian community-store requirements. It is a **report, not a gate**: it is
not part of `check-all` and not run in CI, because the inherited codebase
still trips it. Do **not** run it with `--fix`: it rewrites
`activeWindow.setTimeout` into `window.setTimeout`, undoing the detached-window
compatibility the esbuild `replace` plugin exists to provide.

`node_modules` lives in a Docker named volume (not bind-mounted), to avoid mixing Linux binaries into the macOS host and to keep installs fast.
