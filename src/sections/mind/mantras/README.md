# Mantras module (Phase 3)

The mantra database at `/mind/mantras/`. Per the master specification each
entry carries deity, text, transliteration, meaning, meter and usage, with
an optional free-video embed. The listing groups mantras by purpose
(foundation → peace → wisdom → prosperity → protection → devotion) as static
sections, **zero client JavaScript**.

## Map

```
mantras/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/mantra.ts     # Zod schema for the `mantras` collection
├── content/mantras/*.md
├── lib/domain.ts         # categories + labels + youtubeId helper
├── components/MantraCard.astro
└── pages/
    ├── Index.astro         # /mind/mantras/ (grouped listing)
    └── MantraDetail.astro  # /mind/mantras/{slug}/
```

## Content rules

- `text` is Devanāgarī; `transliteration` is IAST, both required, always.
  Devanāgarī is marked `lang="sa"` for correct pronunciation assist.
- `meaning` translates honestly; where a reading is interpretive (Oṁ Maṇi
  Padme Hūṁ), the entry says so.
- Non-Hindu Indian traditions are included and clearly labelled by
  `tradition` (e.g. the Buddhist Karaṇḍavyūha mantra).
- Mantras traditionally received from a teacher are flagged in their
  `usage` text; nothing on this page claims to initiate.
- `videoUrl` must be a genuinely free, verified rendition; cited again in
  `sources[]`.

## Cross-module wiring

Plain URLs only, registry-guarded: japa meditation entry, the soul pillar's
ashtanga pages. No shared-store reads (mantras are not dosha-driven).

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from every
registry surface; its routes redirect to `/mind/`; `getStaticPaths` emits no
detail pages. No other module is affected.

## Adding an entry

Copy `content/mantra-template.md` to `content/mantras/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the grouped listing, detail routes and search index all derive from the collection.
