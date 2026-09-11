# Satvik.fyi: website build 20260910

A different approach to website building, developed with AI sessions
(Z.ai code plan). The build folder is named `20260910` to mark the
content milestone: 151 recipes, the unified wiki, and Pagefind search.
Origin prompt for the iteration that started this codebase:
[prompts/website/20260822.md](../../prompts/website/20260822.md).

**Operating the site?** Read the [operations manual](./docs/manual/README.md):
content and volunteer editorial guide, VS Code workflow and architecture,
deployment and troubleshooting. **Maintaining it with AI sessions?** The
decision log (`docs/decision-log.md`) is the contract — read it first.

## Status

All 14 registered modules live (meals, yoga, ayurveda, quiz, pranayama,
meditation, mantras, five soul paths, blog, wiki, search), **333 pages**,
five CI gates. Each module documents itself in its own README under
`src/sections/`.

- **Meals**: 151 validated recipes (51 home satvik + 100 satvik temple
  classics), alphabetical listing with a sort control, filter island,
  planner, shopping list; ingredient names canonicalized against
  `content/recipes/ingredients.json` (repo archive; the organization
  scheme is `docs/recipe-taxonomy.md`).
- **Wiki**: the site's unified knowledge layer — scriptures, books,
  deities, worship, concepts, **ingredients**, **cooking techniques** —
  with two-way links to recipes (`src/shared/lib/ingredientBridge.ts`):
  recipe pages link their ingredients, ingredient entries list the
  recipes using them. Former ayurveda substance pages soft-redirect to
  their wiki entries.
- **Search**: Pagefind over the full rendered site (post-build step in
  `npm run build`); self-hosted, offline after first load, alt-names in
  entry bodies are searchable.
- Shared layer: layouts, UI primitives, satvik design tokens (WCAG-AA
  verified), SEO/JSON-LD helpers, versioned localStorage store.

## Quickstart

```bash
nvm use 22        # or any Node >= 18.17.1
npm ci
npm run dev       # http://localhost:4321 (search needs npm run preview)
npm run verify    # check + build + links + search + seo (what CI runs)
```

## Docs

- [docs/prd.md](docs/prd.md): the adapted master specification, sitemap,
  schemas, governance principles, phase acceptance criteria.
- [docs/decision-log.md](docs/decision-log.md): fixed decisions and every
  build decision since (search, wiki, migrations) — start here.
- [docs/adding-a-module.md](docs/adding-a-module.md): the module contract
  as a step-by-step how-to.
- [docs/recipe-taxonomy.md](docs/recipe-taxonomy.md) and
  [docs/unified-wiki.md](docs/unified-wiki.md): the content architecture
  for recipes and the knowledge layer.

> **Deployment model**: the live site runs from its own repository whose
> root is this folder's content, delivered as `<build>.zip` from the
> `satvikfyi_assets` repo. The CI and deploy workflows ship inside this
> folder (`.github/workflows/`) and run from the live repo's root as-is;
> the assets repo archives builds and does not deploy. One-time live-repo
> activation (Pages source, DNS) is documented in the
> [deployment manual](docs/manual/03-deployment-and-troubleshooting.md).
