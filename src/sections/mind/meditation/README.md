# Meditation module (Phase 3)

Dhyāna practices and philosophy at `/mind/meditation/`. Deliberately the
quietest module on the site: **zero client JavaScript**, the listing groups
practices and concepts as static sections instead of shipping a filter
island, honouring the zero-JS default of the module contract.

## Map

```
meditation/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/practice.ts   # Zod schema for `meditation-practices`
├── content/practices/*.md
├── lib/domain.ts         # kind enum + labels
├── components/PracticeCard.astro
└── pages/
    ├── Index.astro            # /mind/meditation/ (grouped listing)
    └── PracticeDetail.astro   # /mind/meditation/{slug}/
```

## Content model

One collection holds both kinds of entry, split by `kind`:

- `practice`, how-to entries with steps, effects, precautions, duration.
- `concept`, the philosophy beneath (dhyāna, sākṣī-bhāva, pratyāhāra);
  their `steps` are "how to explore it in experience", not instructions to
  perform, and the detail page relabels the heading accordingly.

`precautions` defaults to empty (this module's practices are gentle), but
trauma-sensitive notes are written where they apply.

## Cross-module wiring

Plain URLs only, registry-guarded: the sidebar links prāṇāyāma (nāḍī
śodhana) and the mantra database while those modules are `enabled`.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from every
registry surface; its routes redirect to `/mind/`; `getStaticPaths` emits no
detail pages. No other module is affected.

## Adding an entry

Copy `content/practice-template.md` to `content/practices/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the listing, detail routes and search index all derive from the collection.
