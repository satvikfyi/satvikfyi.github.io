# Adding a Module

The module contract as a how-to. Every feature of Satvik.fyi, from the
meal planner to wiki and search, is built this way. Use the `meals`
module (Phase 0 stub) as the living reference.

## The contract in one paragraph

A module is a **self-contained folder** under `src/sections/{pillar}/`
that owns its content collection, schemas, components and pages, plus a
`module.config.ts` manifest. It is wired into the central registry
(`src/config/sections.ts`) and, from that moment; the navbar, footer,
pillar landing pages, home roadmap and sitemap all know about it. A module
may import from `src/shared/` and `src/config/` only, never from another
module. Cross-module references are plain URLs.

## Step by step

### 1. Create the folder skeleton

```
src/sections/body/yoga/
├── module.config.ts          # manifest (see below)
├── schemas/pose.ts           # Zod schema for the module's collection
├── content/poses/*.md        # collection entries (frontmatter validated at build)
├── components/               # PoseCard.astro, PoseFilters.ts, …
└── pages/                    # Index.astro, Detail.astro, …
```

### 2. Write the manifest

```ts
// src/sections/body/yoga/module.config.ts
import type { ModuleSectionConfig } from '../../../config/module';

const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'yoga',                  // unique, kebab-case
  parent: 'body',              // 'body' | 'mind' | 'soul' | null (sitewide)
  title: 'Yogasana',
  description: 'A growing database of asanas …',
  routePrefix: '/body/yoga/',  // starts and ends with '/'
  enabled: true,
  accent: 'saffron',           // one of the design tokens
};

export default config;
```

### 3. Replace the registry placeholder

In `src/config/sections.ts`, delete the matching `placeholder({...})`
entry from `roadmap` and add a static import, placing it beside the other
modules of its pillar:

```ts
import yoga from '../sections/body/yoga/module.config';
// …
export const sections = [bodyPillar, meals, yoga, mindPillar, /* … */];
```

Keep the ordering convention: pillar, then its modules, per pillar; the
sitewide (parent: null) modules last.

### 4. Add the content collection (when the module has content)

Define the Zod schema in the module (`schemas/`), then register a
namespaced collection in `src/content/config.ts` (collection names like
`yoga-poses`, `meals-recipes`). Entries that fail schema validation break
the build, that is the CI gate working, not a bug. Every entry that
states traditional knowledge carries `sources[]`.

### 5. Add routes as thin wrappers

Astro only routes files in `src/pages/`. Keep them one-liners that
delegate to the module's pages:

```astro
---
// src/pages/body/yoga/index.astro
import { isModuleEnabled } from '../../../config/sections';
import Index from '../../../sections/body/yoga/pages/Index.astro';

if (!isModuleEnabled('yoga')) {
  return Astro.redirect('/body/', 302);
}
---
<Index />
```

Detail routes use `getStaticPaths()` inside the module page and the same
thin wrapper pattern. Keep the registry guard so disabling a module
degrades cleanly (redirect to the parent pillar, sitemap entry already
filtered via `disabledRoutePrefixes`).

### 6. Interactivity = islands, self-contained

If the module needs client behaviour (filters, planner, quiz), write it as
a vanilla TS island inside the module's `components/` and load it with
`<script>` in the module's page. Each island bundles its own code; there
is no global client framework. Persist user state with
`createStore(scope, version)` from `src/shared/utils/localStorageStore`
(version the scope when the shape changes).

### 7. Safety, sources, accessibility

- Pages touching health/practice render the shared `Disclaimer` component
  (variants: ayurveda, yoga, pranayama, general). Advanced practices get
  explicit cautions.
- Sanskrit in IAST with translations.
- Semantic landmarks, keyboard operability, focus states, AA contrast
  (stick to the token palette), `ExternalLink` for external URLs.
- Run `npm run verify` (check + build + links) before committing; CI adds
  Lighthouse gates (≥ 0.9 performance, ≥ 0.95 accessibility).

## Disabling / removing a module

- **Disable**: set `enabled: false` in the manifest. The module vanishes
  from nav, footer, pillar page, home roadmap and sitemap; its routes
  redirect to the parent pillar. Nothing else changes.
- **Remove**: delete the module folder, its registry import, its page
  wrappers in `src/pages/…` and its collection entry. If it may come back,
  re-add a placeholder in `sections.ts` instead.

## Checklist (all must pass before a module ships)

- [ ] Folder self-contained; no imports from other modules
- [ ] Manifest complete and registered in `sections.ts`
- [ ] Content collection namespaced + Zod-validated; `sources[]` present
- [ ] Route wrappers thin, with the `isModuleEnabled` redirect guard
- [ ] Islands (if any) are vanilla TS, self-contained, localStorage via
      `createStore`
- [ ] Disclaimers/cautions where content touches health or advanced practice
- [ ] `npm run verify` green; Lighthouse gates met
