# Satvik.fyi: website build 20260822

A different approach to website building.
Z.ai code plan use.

Master prompt for this iteration: [prompts/website/20260822.md](../../prompts/website/20260822.md).
Blank slate. Stack fixed to **Astro + Tailwind (v4) + TypeScript (strict) + Zod**.
Hierarchical module system (Body/Mind/Soul pillars, features as modules;
meals is the first module under `/body/`). Phases 0–6, each with a
standalone AI build prompt, built one phase per session, in order.

**Operating the site?** Read the [operations manual](./docs/manual/README.md):
content and volunteer editorial guide, VS Code workflow and architecture,
deployment and troubleshooting.

## Status

**Phases 0–5 complete**: all 14 registered modules live (meals, yoga,
ayurveda, quiz, pranayama, meditation, mantras, five soul paths, blog,
wiki, search), 189 pages, five CI gates. Each module documents itself in
its own README under `src/sections/`.

- Section registry (`src/config/sections.ts`) with meals enabled and all
  future modules (yoga, ayurveda, pranayama, meditation, mantras, soul
  paths, quiz, blog, wiki, search) registered as disabled placeholders.
- Shared layer: layouts, UI primitives, satvik design tokens (WCAG-AA
  verified), SEO/JSON-LD helpers, versioned localStorage store.
- Pages: home (pillars + planner CTA + roadmap), `/body/ /mind/ /soul/`
  pillar landings, `/body/meals/` stub, `/about/ /contact/ /privacy/
  /disclaimer/`, 404. Zero client JavaScript shipped.
- CI (`astro check` + build + internal link check + Lighthouse CI) and
  GitHub Pages deploy workflow; CNAME `satvik.fyi`.

## Quickstart

```bash
nvm use 22        # or any Node >= 18.17.1
npm ci
npm run dev       # http://localhost:4321
npm run verify    # astro check + build + link check (what CI runs)
```

## Docs

- [docs/prd.md](docs/prd.md): the adapted master specification, sitemap,
  schemas, governance principles, phase acceptance criteria.
- [docs/decision-log.md](docs/decision-log.md): fixed decisions + Phase 0
  build decisions (Tailwind v4 CSS-first, workflow placement, etc.).
- [docs/adding-a-module.md](docs/adding-a-module.md): the module contract
  as a step-by-step how-to; read this before Phase 1.

> **Workflow note**: GitHub only reads workflows from the repository root.
> This folder is laid out to be its own site repository. If it stays nested
> in `satvikfyi_assets`, move `.github/workflows/` to the repo root and set
> `working-directory: website/20260822` (see the note atop each workflow).
