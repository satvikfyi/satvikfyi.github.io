# Meals module (Phase 1)

The complete satvik meal-planning experience at `/body/meals/`: a validated
recipe collection, a filterable listing, recipe detail pages and the weekly
planner island. Everything the module owns lives in this folder; the only
wires outside it are the route wrappers in `src/pages/body/meals/` and the
collection registration in `src/content.config.ts`.

## Map

```
meals/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/recipe.ts     # Zod schema for the `meals-recipes` collection
├── content/recipes/*.md  # recipe entries (frontmatter validated at build)
├── lib/
│   ├── domain.ts         # enums, labels; pure, shared by pages + islands
│   ├── plan.ts           # plan generation / swap / validation (pure)
│   ├── shoppingList.ts   # ingredient aggregation with quantity math (pure)
│   └── jsonld.ts         # schema.org/Recipe builder
├── components/
│   ├── RecipeCard.astro  # listing card (carries filter data attributes)
│   ├── DoshaChips.astro  # vāta/pitta/kapha effect chips
│   ├── RecipeFilters.ts  # island: listing filters (no-JS → full list)
│   └── Planner.ts        # island: dosha → 7-day plan → shopping list
├── styles/print.css      # print rules for detail + planner pages
└── pages/
    ├── Index.astro       # /body/meals/ (listing)
    ├── RecipeDetail.astro# /body/meals/recipes/{slug}/
    └── Planner.astro     # /body/meals/planner/
```

## localStorage contract (shared store keys)

Both keys are created via `createStore(scope, 1)` from
`src/shared/utils/localStorageStore`, i.e. the full key names are
`satvikfyi:v1:{scope}`.

| Scope | Owner | Shape | Used by |
| --- | --- | --- | --- |
| `meals-planner` | this module | `Plan` from `lib/plan.ts` (dosha, generatedAt, 7 × 3 recipe slugs) | planner island (read/write) |
| `quiz-result` | dosha quiz module (Phase 2, to be built) | `{ dosha: 'vata' \| 'pitta' \| 'kapha', … }` | planner island (read-only) |

**Phase 2 note:** the dosha quiz should write its result to
`satvikfyi:v1:quiz-result` with at least `{ dosha }`, the planner already
reads that key to preselect a dosha on first visit. Keep the key versioned
via the store's `version` argument; a bump orphans old data safely.

## Adding a recipe

1. Copy `content/recipe-template.md` into `content/recipes/{slug}.md` and
   fill it in, frontmatter must satisfy `schemas/recipe.ts` (the build
   fails otherwise, by design).
2. Nothing else: listing, detail route, planner pool, filters and shopping
   list all render from the collection.

Conventions that keep the shopping list tidy:

- `slug` must match the file name (kebab-case).
- Ingredient `item` strings are the grouping key, reuse canonical names
  (`ghee`, `moong dal (split yellow)`, `coconut (fresh grated)`, …).
- `quantity` should parse as `amount unit` (`1 cup`, `½ tsp`, `2 tbsp`,
  `200 g`) or be a note like `to taste`.
- Every entry carries `sources[]`; classical citations name the text and
  chapter/verse rather than invented verse numbers.

## Filtering semantics

- **Dosha filter** shows recipes whose `doshaEffects[dosha]` is `balancing`.
- **Season filter** shows recipes listing the season or `all-year`.
- Meal and tag filters match exactly. All filters AND together.
- Deep links: `/body/meals/?dosha=vata&meal=breakfast&season=summer&tag=light`.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from nav,
footer, pillar page, home roadmap and sitemap; its routes redirect to
`/body/`; `getStaticPaths` emits no detail pages. No other module is
affected.
