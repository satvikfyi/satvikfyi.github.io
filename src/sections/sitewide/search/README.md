# Search module (Phase 5, sitewide)

The discovery layer at `/search/`: build-time JSON indexes generated from
every enabled module's **public content-collection API** plus the registry's
own pages, searched client-side by a self-contained Fuse.js island.

## Map

```
search/
├── module.config.ts          # manifest (registered in src/config/sections.ts)
├── lib/index-builder.ts      # build-time: collections + registry → SearchDoc[]
├── components/SearchIsland.ts# Fuse.js island (fetches index once)
└── pages/Search.astro        # /search/ (input + results + no-JS fallback)
```

Routes: `src/pages/search/index.astro` (page),
`src/pages/search/index.json.ts` (merged index) and
`src/pages/search/[id].json.ts` (per-collection chunks).

## How the index is built

- Each collection maps to its module: the chunk is emitted **only while that
  module is enabled** (registry-driven). Soul teachings link to their path
  module's overview page anchor (`#teaching-{slug}`) and are indexed only
  while that path module is enabled, the soul-path→module mapping is a
  local copy here, per the no-module→module-imports rule.
- Document fields are single-letter (`t` title, `d` description, `u` url,
  `c` section, `k` keywords) to respect the size budget; the island's Fuse
  config uses the same keys.
- Registry pages (home, pillars, module landings, planner, static pages)
  are indexed in a `pages` chunk.
- Budget: the merged index must stay **< 300 KB**, enforced by
  `npm run check:search` in CI.

## The island

- Fetches `/search/index.json` **once** on first focus (warmed eagerly),
  keeps it in memory, every keystroke after that is local, and the index is
  a same-origin static asset, so search keeps working offline after first
  load.
- Debounced (140 ms), deep-linkable (`/search/?q=kitchari`), results
  announced via `role="status"`.
- No-JS fallback: the page shows pillar/module links.

## Header box (progressive enhancement)

`SiteHeader` renders a plain `GET` form (`action="/search/"`, input `name="q"`),
 zero JavaScript. Submitting navigates to `/search/?q=…`, where the island
picks the query up. The box renders only while the search module is enabled.

## Disabling

Set `enabled: false` in `module.config.ts`: `/search/` redirects home, the
JSON endpoints 404, and the header box disappears from every page. The CI
gate (`check:search`) is disable-aware, it detects the redirect stub and
skips, so a search-disabled build stays green while an *accidentally*
missing index still fails the gate.
