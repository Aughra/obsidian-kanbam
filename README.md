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
docker compose build                        # build the dev image (Node LTS + yarn)
docker compose run --rm dev yarn install     # install dependencies (into a named volume)
docker compose run --rm dev yarn build       # build main.js / styles.css
docker compose run --rm dev yarn run typecheck
```

`node_modules` lives in a Docker named volume (not bind-mounted), to avoid mixing Linux binaries into the macOS host and to keep installs fast.
