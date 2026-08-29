# Pranayama module (Phase 3)

The breathing-technique database at `/mind/pranayama/`: a Zod-validated
collection of classical prāṇāyāmas with Sanskrit (IAST) names, rhythms,
benefits, dosha associations, and safety as a structural requirement. Every
entry MUST carry at least one contraindication (schema-enforced `min(1)`),
and advanced practices set `requiresTeacher: true`, which renders a prominent
warning banner. The shared pranayama disclaimer appears on every page.

## Map

```
pranayama/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/technique.ts  # Zod schema for `pranayama-techniques`
├── content/techniques/*.md
├── lib/domain.ts         # categories, levels, dosha labels; client-safe
├── components/
│   ├── TechniqueCard.astro    # listing card (filter data attributes)
│   └── TechniqueFilters.ts    # island: filters (no-JS → full list)
└── pages/
    ├── Index.astro            # /mind/pranayama/
    └── TechniqueDetail.astro  # /mind/pranayama/{slug}/
```

## Safety rules (how they are enforced)

- `contraindications[]` is `min(1)`, a technique without an honest caution
  fails the build. This is deliberate: the phase brief made safety notes
  mandatory, so the schema is the gate.
- `requiresTeacher: true` (e.g. bhastrīka) renders a `role="warning"` banner
  and a "Learn with a teacher" tag on cards.
- The listing sidebar carries a standing "Read this first" safety panel and
  the page ends with the shared `Disclaimer variant="pranayama"`.
- Verse citations are hedged honestly, where editions differ or a claim is
  the text's own (worms, worms-cure), the entry says so.

## Filtering semantics

- **Dosha filter** shows techniques whose `associatedDoshas` includes the dosha.
- Effect (category) and level filters match exactly. All AND together.
- Deep links: `/mind/pranayama/?dosha=kapha&category=cleansing`.
- With no `?dosha=`, the island seeds the dosha select from the shared
  `satvikfyi:v1:quiz-result` store (read-only).

## Cross-module wiring

Plain URLs only: pose seats (sukhāsana, vajrāsana, padmāsana) link to
`/body/yoga/…` while yoga is `enabled`; the quiz CTA links `/quiz/`. The
module reads, never writes; the `quiz-result` key.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from nav,
footer, pillar page, roadmap and sitemap; its routes redirect to `/mind/`;
`getStaticPaths` emits no detail pages. No other module is affected.

## Adding an entry

Copy `content/technique-template.md` to `content/techniques/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the listing, detail routes, filters, search index and sitemap all derive from the collection.
