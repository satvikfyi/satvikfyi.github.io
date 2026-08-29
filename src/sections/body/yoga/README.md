# Yoga module (Phase 2)

The asana database at `/body/yoga/`: a Zod-validated collection of classical
poses with Sanskrit (IAST) names, steps, benefits, contraindications, dosha
associations and free video guides. Everything the module owns lives in this
folder; the only wires outside it are the route wrappers in
`src/pages/body/yoga/` and the collection registration in
`src/content.config.ts`.

## Map

```
yoga/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/pose.ts       # Zod schema for the `yoga-poses` collection
├── content/poses/*.md    # pose entries (frontmatter validated at build)
├── lib/
│   ├── domain.ts         # categories, levels, dosha labels; client-safe
│   └── jsonld.ts         # schema.org/HowTo builder
├── components/
│   ├── PoseCard.astro    # listing card (carries filter data attributes)
│   └── PoseFilters.ts    # island: listing filters (no-JS → full list)
└── pages/
    ├── Index.astro       # /body/yoga/ (listing)
    └── PoseDetail.astro  # /body/yoga/{slug}/
```

## Conventions

- `slug` must match the file name (kebab-case).
- `sanskritName` uses IAST transliteration (Tāḍāsana, Śavāsana, …).
- `videoUrl` is a full YouTube URL (any common form); the shared
  `YouTubeEmbed` renders it as a lazy `youtube-nocookie.com` iframe. Only add
  videos that are genuinely free to watch, and cite them in `sources[]`.
- `associatedDoshas` lists the doshas the pose traditionally *helps balance*
  (1–3); it is not a claim about curing anything.
- Every entry carries `sources[]`; classical citations name the text and
  chapter/verse, modern guides are marked as further guidance.

## Filtering semantics

- **Dosha filter** shows poses whose `associatedDoshas` includes the dosha.
- Category and level filters match exactly. All filters AND together.
- Deep links: `/body/yoga/?dosha=vata&category=standing&level=beginner`.
- With no `?dosha=` in the URL, the island seeds the dosha select from the
  shared `satvikfyi:v1:quiz-result` store (read-only) when one exists.

## Cross-module wiring

Links out are plain URLs only: pose pages link to `/body/meals/?dosha={d}`
and `/quiz/`, each rendered only while that module is `enabled` in the
registry (checked via `isModuleEnabled`, never via imports). This module
reads, and never writes; the `quiz-result` shared-store key.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from nav,
footer, pillar page, home roadmap and sitemap; its routes redirect to
`/body/`; `getStaticPaths` emits no detail pages. No other module is
affected, other modules' links to `/body/yoga/…` still resolve (to the
redirect), and their own guards hide optional links.

## Adding an entry

Copy `content/pose-template.md` to `content/poses/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the listing, detail routes, filters, search index and sitemap all derive from the collection.
