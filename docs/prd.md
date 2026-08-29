# Satvik.fyi — Product Requirements (Phase 0 adaptation)

This document adapts the Master AI Build Specification v5 for the site built
in `website/20260822/`. The decision log is fixed and is not re-litigated;
see `decision-log.md`.

## What this is

A **non-profit, static, modular wellness site** based on ancient Indian
wisdom — the satvik lifestyle: yogasana, ayurveda, satvik diet, pranayama,
chanting, karma yoga, ashtanga yoga, tantra, bhakti yoga. The site is built
in phases; each phase is delivered by a separate AI session working only
from its phase prompt, so contracts (registry, module boundaries, quality
gates) are strict.

## Core architectural principle — hierarchical module system

The entire site is a two-level tree of modules:

- **Pillars** (top level, fixed): `/body/`, `/mind/`, `/soul/` — landing
  pages that auto-list their enabled child modules.
- **Modules** (children, unlimited): every feature is a module registered
  under a pillar (or sitewide). The meal planner is simply the first module;
  all others follow the identical contract.

```
body                         mind                    soul
├── meals      (Phase 1)    ├── pranayama (3)       ├── action     (karma yoga, 3)
├── yoga       (Phase 2)    ├── meditation (3)      ├── knowledge  (gyan yoga, 3)
└── ayurveda   (Phase 2)    └── mantras   (3)       ├── devotion   (bhakti yoga, 3)
                                                     ├── meditation (ashtanga/dhyan, 3)
sitewide                                             └── tantra     (3)
├── quiz   (2)   ├── blog (4)   ├── wiki (4)   └── search (5)
```

### Module contract (every module must obey)

1. **Self-contained folder**: a module owns its `content/` (collection +
   Zod schema), `components/`, `pages/`, and a `module.config.ts` manifest.
   Nothing else may live inside or reach into it.
2. **Registry-driven**: each manifest declares `id`, `title`, `parent`
   (pillar or null), `routePrefix`, nav visibility, `enabled`. The central
   `src/config/sections.ts` aggregates manifests via static imports;
   navbar, footer, pillar landing pages and the sitemap render only from
   the registry.
3. **Dependency direction**: `sections/** → shared/**` only. Never
   module→module. Cross-module references are plain URLs
   (e.g. a yoga pose links to `/body/meals/?dosha=vata`).
4. **Isolated content collections**: each module defines its own Astro
   collection + schema, namespaced (`meals-recipes`, `yoga-poses`, …).
5. **Replaceable/removable**: `enabled: false` (or deleting the folder +
   registry line) removes the module cleanly; pillar pages degrade
   gracefully, routes redirect to the parent pillar.
6. **Zero-JS default**: pages ship no client JS unless the module declares
   an island; each island bundles its own code (vanilla TS), no global
   client framework.

### Shared layer contract (`src/shared/` — thin, generic only)

Base layouts, UI primitives (PageHeader, Card, Tag, ExternalLink,
YouTubeEmbed, Disclaimer), design tokens (satvik palette, IAST-friendly
type stack), SEO meta + JSON-LD helpers, `localStorageStore` (versioned,
namespaced keys), and the generic pillar-landing mechanism. No domain
logic in shared.

## Full sitemap (provisioned from day one)

| Route                                | Type                          | Phase |
| ------------------------------------ | ----------------------------- | ----- |
| `/`                                  | Home: pillars + planner CTA   | 0/1   |
| `/body/`                             | Pillar landing (auto-lists)   | 0     |
| `/body/meals/`                       | Recipes listing + filters     | 1     |
| `/body/meals/recipes/{slug}/`        | Recipe detail                 | 1     |
| `/body/meals/planner/`               | Weekly planner island         | 1     |
| `/body/yoga/`, `/body/yoga/{slug}/`  | Asana database                | 2     |
| `/body/ayurveda/`, `/{slug}/`        | Herbs/ingredients             | 2     |
| `/quiz/`                             | Dosha questionnaire           | 2     |
| `/mind/…`                            | Mind pillar modules           | 3     |
| `/soul/{action,knowledge,devotion,meditation,tantra}/` | Soul paths | 3 |
| `/blog/`, `/blog/{slug}/`, `/blog/tag/{tag}/` | Blog             | 4     |
| `/wiki/`, `/wiki/{category}/{slug}/` | Wiki (scriptures, books, gods, worship) | 4 |
| `/search/`                           | Global search (Fuse.js)       | 5     |
| `/about/ /contact/ /privacy/ /disclaimer/` | Static pages            | 0     |
| `shop.satvik.fyi`, `community.satvik.fyi` | DNS redirects → external   | 6     |

**Nav rule (strict)**: the navbar shows only the three pillars (+ site
title). Everything else — Shop, Community, Newsletter, Contact, About —
lives in the footer, driven by the registry/footer config.

## Data & schemas (Zod, per module)

Illustrative schemas; final ones live in each module but follow this style:

- **Recipe**: title, slug, mealType (breakfast|lunch|dinner|snack),
  ingredients[], steps[], prepTime, cookTime, servings, satvicTags[],
  doshaEffects{vata,pitta,kapha: balancing|neutral|aggravating},
  seasonalSuitability[], dietNotes, image?, videoUrl?, sources[]
- **Yoga pose**: name, sanskritName, category, level, benefits[],
  contraindications[], steps[], breathingPattern, associatedDoshas[],
  image?, videoUrl?, sources[]
- **Ayurveda entry**: name, partUsed, doshaEffects, properties[],
  indications[], contraindications[], preparation, sources[]
- **Mantra**: deity, text, transliteration, meaning, meter, usage,
  audioUrl?, videoUrl?
- **Wiki article**: title, category (scriptures|books|gods|worship|concepts),
  summary, references[], related[]
- **Blog post**: title, date, tags[], excerpt, coverImage?, author

All entries carry `sources[]` where they state traditional knowledge.
Missing-schema entries fail the build — validation is a CI gate.

## Content & governance principles (every phase)

- Non-profit, non-dogmatic, respectful of traditions; cite sources;
  distinguish scripture from modern interpretation.
- Mandatory disclaimers: Ayurvedic/medical disclaimer component on recipes,
  herbs, poses, pranayama; consult-a-professional notes for advanced
  practices (pranayama, tantra get content warnings).
- Sanskrit terms shown with IAST transliteration; prefer open licenses
  (CC BY) for content.
- Privacy-first: no trackers, no cookies; localStorage only for user
  convenience. (Optional privacy-friendly analytics is a Phase 6 question.)

## CI/CD & quality gates (every phase keeps these green)

- **ci.yml**: `npm ci` → `astro check` (types/schemas) → `astro build` →
  internal link check (`scripts/check-links.mjs`) → Lighthouse CI
  (min 0.9 performance / 0.95 accessibility, asserted in
  `lighthouserc.json`).
- **deploy.yml**: build and publish to GitHub Pages on push to `main`;
  `public/CNAME` pins `satvik.fyi`.
- **WCAG AA**: semantic landmarks, skip link, visible focus states, alt
  text, 4.5:1 contrast (verified in the palette), keyboard navigation;
  `target="_blank"` links carry `rel="noopener noreferrer"` and a
  visually-hidden "(opens in a new tab)".

## Anti-patterns (STRICTLY FORBIDDEN)

No backend, serverless, DB, or env-dependent runtime secrets. No native
e-commerce, checkout, forum, or newsletter signup forms. No client-side
routing libraries. No React/Next/Vue/Svelte. No Tailwind CDN. No
cross-module imports. No module that breaks another module's build. No PII
collection.

## Phase 0 scope (this build)

Astro 5 + TypeScript strict + Tailwind v4 scaffold with the hierarchical
module system in place; meals module registered and stubbed; yoga,
ayurveda, pranayama, meditation, mantras, soul paths, quiz, blog, wiki,
search registered as disabled placeholders; shared layer complete; home,
three pillar landings and the four static pages rendered; CI and deploy
workflows; docs. **No feature content or interactivity** — that belongs to
later phases.

### Phase 0 acceptance criteria

- [x] Clean clone → `npm ci && npm run build` succeeds.
- [x] All stub routes render (home, 3 pillars, meals stub, 4 static pages, 404).
- [x] Disabling a module in the registry removes it from nav, pillar page,
      footer, home CTA and sitemap without errors; its route redirects to
      the parent pillar. (Verified for `meals`.)
- [ ] GitHub Pages deploy works (requires repo placement + Pages setting —
      see decision log; not verifiable from the build machine).
- [x] Lighthouse ≥ 0.9 / ≥ 0.95 on key pages (asserted by CI; zero-JS
      static pages; local verification is configuration-only).
