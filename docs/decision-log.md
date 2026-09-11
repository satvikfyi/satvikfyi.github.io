# Decision Log

Fixed decisions from the Master Specification (v5), do not re-litigate; 
followed by the concrete decisions made while building Phase 0.

## Fixed (from the master specification)

| Decision            | Choice                                   | Rationale                                                                                              |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| SSG / framework     | Astro 5.x                                | Content collections + Zod validation, zero-JS by default, islands for interactivity, first-class Pages  |
| Styling             | Tailwind CSS v4 (build step)             | Production CSS, no runtime penalty, meets Lighthouse targets; **not** CDN                              |
| Language            | TypeScript strict                        | Schema/type safety across modules                                                                      |
| Content validation  | Zod via Astro content collections        | Replaces custom AJV validation scripts                                                                 |
| Interactivity       | Vanilla TS islands (framework-free)      | Planner, quiz, filters ship as small self-contained scripts; no React/Vue runtime                      |
| Persistence         | localStorage only                        | No backend, no PII, no cookies                                                                         |
| Hosting             | GitHub Pages via GitHub Actions          | Free; custom domain satvik.fyi (CNAME)                                                                 |
| Video               | YouTube nocookie embeds                  | Free hosting, privacy-enhanced                                                                         |
| Newsletter          | Substack external link/embed             | No native forms                                                                                        |
| Comments            | Giscus (GitHub Discussions), later      | Free, static-friendly                                                                                  |
| Shop                | Subdomain redirect → external free svc   | No native e-commerce                                                                                   |
| Community           | Subdomain redirect → external free svc   | No native forum                                                                                        |
| Search              | ~~Build-time JSON index + client Fuse.js~~ → **Pagefind** (decision 16) | Static, offline-capable, self-hosted; full-content search                                |

Superseded attempts (context only): `website/20250806` (Next.js + Prisma),
`website/20250807` and `prompts/website/20251216` (unresolved-stack PRDs).

## Phase 0 build decisions

1. **Node via nvm, v22 LTS (22.23.2)**, the build machine had no Node; nvm
   was installed and `nvm use` wired into `~/.bashrc`. Engines floor stays
   at 18.17.1 (Astro 5 minimum) for CI portability; CI pins Node 22.
2. **Tailwind v4, CSS-first; no `tailwind.config.ts`**, Tailwind v4's
   Vite plugin consumes `@theme` blocks directly in
   `src/shared/styles/tokens.css`. A JS config file would be dead weight;
   the master spec's directory sketch predates this v4 idiom. The tokens
   file is the single source of truth for palette and type stacks.
3. **`@tailwindcss/typography` via `@plugin`**, pulled in during Phase 0
   (not later) so ArticleLayout prose styling is stable before blog/wiki/
   recipe phases build on it.
4. **No web fonts, system stacks with Noto fallbacks**; zero external
   requests (privacy-first, faster LCP). IAST diacritics (ā ī ū ṛ ṣ ṭ …)
   fall back per-glyph to Noto Sans/Serif when installed. All chosen
   `*-deep` text tokens verified ≥ 4.5:1 on cream/parchment (checked in
   `scripts/contrast-check.mjs` during Phase 0; not a CI gate).
5. **Workflows assume this folder is the repo root**, per the master spec's
   canonical layout (`website/20260822/.github/workflows/`). GitHub only
   reads workflows from a repository root, so if the site stays nested in
   `satvikfyi_assets`, move `.github/` to the repo root and add
   `defaults.run.working-directory: website/20260822` (plus
   `path: website/20260822/dist` on the Pages artifact upload). Both files
   carry this note as a comment.
6. **Link check is a zero-dependency Node script** (`scripts/check-links.mjs`)
   rather than a third-party crawler, it walks `dist/`, resolves every
   internal `href`/`src`, and fails the build on dead links or a missing
   sitemap. External URLs are skipped (availability ≠ build correctness).
7. **Sitemap is registry-driven**, `@astrojs/sitemap` filters routes by
   `disabledRoutePrefixes` exported from the section registry, so flipping
   `enabled: false` removes a module from the sitemap with no config edits.
8. **Disabled module routes redirect**, a disabled module's page wrapper
   `Astro.redirect`s to the parent pillar (static meta-refresh + noindex)
   instead of 404ing, so old links degrade softly.
9. **Home planner CTA is registry-aware**, links to `/body/meals/` while
   enabled, else to `/body/`. Keeps every registry-driven surface
   consistent with the module contract.
10. **Placeholder manifests live in `sections.ts`, not folders**; future
    modules are registered as `placeholder: true, enabled: false` literal
    objects. When a phase builds a real module, its folder manifest import
    replaces the placeholder (documented in `adding-a-module.md`). This
    keeps unfinished modules from cluttering the tree while the full
    sitemap stays provisioned.
11. **Unique ids for same-named modules**, `meditation` appears under both
    mind and soul in the roadmap; registry ids are `meditation` (mind) and
    `soul-meditation` (soul, route `/soul/meditation/`) to keep ids unique.
12. **Pillar landing is one generic shared component** (`PillarLanding.astro`)
    fed by each pillar's manifest; per-pillar `pages/Index.astro` files are
    thin wrappers. Generic presentation, no domain logic; within the
    shared-layer contract.
13. **Contact is a mailto, not a form**; `hello@satvik.fyi` placeholder in
    `src/config/site.ts` until the mailbox exists; update there when DNS
    goes live.
14. **No analytics, no cookies, no external embeds in Phase 0**; the only
    third-party HTML on any page is none; YouTubeEmbed exists in shared but
    is unused until modules need it.

## Content architecture decisions (2026-09-10)

15. **`content/recipes/` is strictly an archive; the hosted collection is
    the website folder; non-satvik is never hosted.** The archive keeps
    `satvik/` (51 home recipes), `non-satvik/` (personal-use recipes,
    excluded from hosting by policy) and `recipes_new/` (100 satvik temple
    recipes + master catalog + generation scripts). The hosted collection
    at `src/sections/body/meals/content/recipes/` is flat, satvik-only,
    and received all 100 temple recipes on 2026-09-10. The ingredient
    audit (`content/scripts/audit-ingredients.py`) now gates the hosted
    collection by default and scans the archive only with `--all`. Full
    scheme: `docs/recipe-taxonomy.md` (fields v2 pending family review).

16. **Search moved from Fuse.js to Pagefind (2026-09-11)**, superseding
    the fixed-decision table's original search row. The build script is
    now `astro build && pagefind --site dist` (pagefind is a
    devDependency, so CI picks it up via `npm run build` with no
    workflow edits). `BaseLayout` marks `<main data-pagefind-body>` so
    only page content is indexed (chrome never leaks into results),
    carries `section`/`description` result metadata via
    `data-pagefind-meta`, and excludes `noindex` pages from the index.
    Removed: `search/lib/index-builder.ts`, both
    `src/pages/search/*.json.ts` endpoints, the `fuse.js` dependency,
    and the 300 KB single-index budget (Pagefind chunks its index).
    `check:search` now gates that `dist/pagefind/` exists and covers
    the site. Rationale: the old index searched only titles/summaries/
    tags — recipes were unfindable by ingredient — and every new module
    needed hand-wiring; Pagefind indexes full rendered content
    (289 pages, verified in-browser: "tamarind" → 26 results, "tej
    patta" → 14) and needs none.

17. **The wiki became the unified knowledge layer (2026-09-11)**, per
    `docs/unified-wiki.md`: two new categories (`ingredients`,
    `cooking-techniques`, domain-qualified so technique explainers for
    other pillars stay in `concepts`); the optional `dravya` frontmatter
    section with strict enums (the ghee rule: one entry, kitchen and
    ayurveda inside); and the recipe ↔ wiki two-way link via
    `src/shared/lib/ingredientBridge.ts` — an explicit `ingredientItem`
    frontmatter field matching the canonical ingredient name joins
    forward links on recipe pages (items without entries stay text) to
    "Used in N recipes" backlinks on entries (one inverted map per
    build). 44 articles seeded/converted; the 15 overlapping ayurveda
    entries script-converted into `dravya` entries with their old URLs
    now soft-redirect stubs (`movedTo` field; meta-refresh + canonical
    to the wiki URL, no noindex, `searchExclude`d from Pagefind —
    Astro config-level redirects are ruled out because they bypass
    BaseLayout). The ayurveda module keeps the 5 medicinal herbs.
    Verified in-browser: dalma links its six covered ingredients, ghee
    shows its dravya profile and "Used in 104 recipes",
    /body/ayurveda/ghee/ redirects, and "sendha namak" finds the
    rock-salt entry.

18. **Build folder renamed `20260822` → `20260910`; deployment model
    settled (2026-09-11)**: the live site runs from its own repository
    whose root is this folder's content, delivered as `<build>.zip`
    (e.g. `20260910.zip`) from the `satvikfyi_assets` archive repo —
    which gitignores the open `website/` folder and never deploys. The
    CI and deploy workflows therefore stay INSIDE the build folder
    (`.github/workflows/`, no working-directory, `path: ./dist`), where
    they run from the live repo's root as-is; the zip must include the
    dotfiles (workflows + `.gitignore`) to be complete for live. (A
    same-day attempt to relocate the workflows to the assets repo root
    was reverted when the family clarified the model.) The rename was
    propagated to the archive-side scripts
    (`content/scripts/audit-ingredients.py`,
    `migrate-ingredient-names.py`), the archive docs, and every manual
    path reference; `prompts/` and the historical entries above keep
    the old name as history. Also recorded here: the **listing-default
    rule** (meaningful-facet grouping with A–Z inside for small
    collections; flat A–Z past ~40–50 items; sort controls only when
    scale or a second key justifies them; blogs stay newest-first —
    now `docs/adding-a-module.md` step 5b), and the handoff-zip
    procedure in the deployment manual. Handover docs (readme, manual
    1–3, module READMEs) refreshed for future moderators, volunteers,
    and LLM sessions; the readme's "read the decision log first" note
    is the intended entry point for AI maintainers.
