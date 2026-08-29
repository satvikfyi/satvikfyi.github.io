# Soul paths: shared implementation (Phase 3)

The five soul-pillar modules, **action** (Karma Yoga), **knowledge** (Gyan
Yoga), **devotion** (Bhakti Yoga), **soul-meditation** (Ashtanga & Dhyan,
public route `/soul/meditation/`) and **tantra**, share one implementation
and one content collection, exactly as the Phase 3 brief permits ("soul
paths may share one 'paths' module internally with category pages").

This folder is **not** a registry module. It owns the shared pieces:

```
soul/
├── paths/                        # the shared implementation (this folder)
│   ├── lib/domain.ts             # the five paths + module-id mapping
│   ├── schemas/teaching.ts       # Zod schema for `soul-teachings`
│   ├── content/teachings/*.md    # scriptural passages + reflections
│   └── components/
│       ├── TeachingArticle.astro # one teaching rendered as an article
│       ├── SiblingPaths.astro    # registry-driven links to the other paths
│       └── ContentWarning.astro  # the advisory banner (tantra uses it)
├── action/…devotion/knowledge/meditation/tantra/
│   ├── module.config.ts          # the registry manifest (id, route, accent)
│   └── pages/Index.astro         # curated overview page for the path
```

Each path's `pages/Index.astro` owns its curated prose (essence, practice
guidance, cross-links) and renders its teachings from the shared collection
filtered by `path`. No detail routes exist, the master sitemap provisions
only `/soul/{module}/` overview pages.

## Content rules

- Every teaching cites `scripture` + `reference` and carries `sources[]`;
  Sanskrit passages appear in IAST (`sanskrit`) with a `translation`.
- Reflections (the markdown body) are the site's own voice, clearly
  interpretive, never presented as scripture.
- Tantra is **introductory-only by design**: content-warning banner first,
  scholarly framing, no ritual instructions, explicit pointer to living
  lineages.

## Disabling

Each of the five modules disables independently, `enabled: false` in its
own `module.config.ts` removes it from every registry surface and redirects
its route to `/soul/`. Its teachings simply stop being rendered anywhere
(the shared collection itself is inert without a rendering module).

## Adding an entry

Copy `content/teaching-template.md` to `content/teachings/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the path overview pages' From the tradition sections and search index all derive from the collection.
