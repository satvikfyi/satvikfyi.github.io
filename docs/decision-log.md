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
| Search              | Build-time JSON index + client Fuse.js   | Static, offline-capable; later phase                                                                  |

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
