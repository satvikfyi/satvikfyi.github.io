# Ayurveda module (Phase 2)

Herbs and kitchen ingredients with classical energetics at `/body/ayurveda/`:
tastes (rasa), properties (guṇa/vīrya), dosha effects, traditional
indications, honest contraindications and preparation; every page carrying
the mandatory ayurvedic disclaimer. Everything the module owns lives in this
folder; the only wires outside it are the route wrappers in
`src/pages/body/ayurveda/` and the collection registration in
`src/content.config.ts`.

## Map

```
ayurveda/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/entry.ts      # Zod schema for the `ayurveda-entries` collection
├── content/entries/*.md  # herb & ingredient entries (validated at build)
├── lib/domain.ts         # tastes, properties, labels; client-safe
├── components/
│   ├── EntryCard.astro       # listing card (carries filter data attributes)
│   ├── DoshaEffectChips.astro# vāta/pitta/kapha effect chips
│   └── EntryFilters.ts       # island: listing filters (no-JS → full list)
└── pages/
    ├── Index.astro       # /body/ayurveda/ (listing)
    └── EntryDetail.astro # /body/ayurveda/{slug}/
```

## Content rules

- `slug` must match the file name (kebab-case).
- `sanskritName` uses IAST transliteration; classical terms in prose too.
- `tastes[]` and `properties[]` validate against the controlled vocabularies
  in `lib/domain.ts`, extend the vocabulary there, not with free strings.
- `indications[]` record traditional usage for study, phrase them as
  tradition, never as treatment promises.
- `contraindications[]` is where honesty lives; do not soften it.
- Every entry carries `sources[]`; classical citations name the text and
  chapter/verse rather than invented verse numbers.

## Filtering semantics

- **Dosha filter** shows entries whose `doshaEffects[dosha]` is `balancing`.
- Kind filter (herb / ingredient) matches exactly. Filters AND together.
- Deep links: `/body/ayurveda/?dosha=pitta&kind=herb`.
- With no `?dosha=` in the URL, the island seeds the dosha select from the
  shared `satvikfyi:v1:quiz-result` store (read-only) when one exists.

## Cross-module wiring

Links out are plain URLs only: detail pages link to `/body/meals/?dosha={d}`
and `/body/yoga/?dosha={d}` for the doshas the entry balances, plus `/quiz/`,
each rendered only while the target module is `enabled` (via
`isModuleEnabled`, never via imports). This module reads, and never writes; 
the `quiz-result` shared-store key.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from nav,
footer, pillar page, home roadmap and sitemap; its routes redirect to
`/body/`; `getStaticPaths` emits no detail pages. No other module is
affected.

## Adding an entry

Copy `content/entry-template.md` to `content/entries/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the listing, detail routes, filters, search index and sitemap all derive from the collection.
