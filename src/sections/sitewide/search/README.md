# Search module (Phase 5, sitewide)

The discovery layer at `/search/`: **Pagefind** indexes the rendered
site after every build, so everything visible on a page — recipe
ingredients, steps, prose, wiki bodies — is searchable. No server, no
external requests: the index and runtime are static files under
`/pagefind/`, loaded once by the island and cached by the browser
(search keeps working offline; nothing typed is transmitted).

## Map

```
npm run build
  └─ astro build             # renders dist/
  └─ pagefind --site dist    # indexes dist/**/*.{html} into dist/pagefind/

search/
├── module.config.ts           # manifest (registered in src/config/sections.ts)
├── components/SearchIsland.ts # island: loads /pagefind/pagefind.js once,
│                              # debounced search, deep links via ?q=
└── pages/Search.astro         # /search/ (input + results + no-JS fallback)
```

Indexing is controlled from `src/shared/layouts/BaseLayout.astro`:
`<main data-pagefind-body>` restricts the index to page content (header
and footer chrome never leaks into results), `data-pagefind-meta`
attributes carry the result eyebrow (`section`, derived from the owning
module's route prefix) and description, and pages rendered with
`noindex` are excluded from the index entirely.

## The island

- Loads the Pagefind runtime **once** on first focus (warmed eagerly);
  every search after that is local. The index chunks are same-origin
  static assets, so search keeps working offline after first load.
- Debounced (140 ms), deep-linkable (`/search/?q=kitchari`), results
  announced via `role="status"`.
- No-JS fallback: the page shows pillar/module links.
- The runtime exists **only after a build** — under `npm run dev` the
  status line says so; test search with `npm run preview`.

## Header box (progressive enhancement)

`SiteHeader` renders a plain `GET` form (`action="/search/"`, input
`name="q"`), zero JavaScript. Submitting navigates to `/search/?q=…`,
where the island picks the query up. The box renders only while the
search module is enabled.

## CI gate

`npm run check:search` (`scripts/check-search-index.mjs`) asserts
`dist/pagefind/` exists and covers the whole site (50+ pages). It is
disable-aware: when `/search/` is a redirect stub it only checks the
index itself, so a search-disabled build stays green while an
accidentally missing index still fails.

## Disabling

Set `enabled: false` in `module.config.ts`: `/search/` redirects home
and the header box disappears from every page. Pagefind still indexes
the rest of the site (the index is content, not the search page).

## Why Pagefind (decision 16, 2026-09-11)

The previous build-time JSON index + client Fuse.js searched only
titles, summaries and tags — a recipe could not be found by its
ingredients — and every new module needed hand-wiring into the index
builder inside a 300 KB single-file budget. Pagefind indexes full page
content, chunks its index (no budget anxiety), and is fully
self-hosted. The swap removed `lib/index-builder.ts`, the two
`src/pages/search/*.json.ts` endpoints, and the `fuse.js` dependency;
new modules are indexed automatically once rendered.
