# Blog module (Phase 4, sitewide)

The long-form content engine at `/blog/`. **Authoring a post = adding one
markdown file to `content/posts/`**, the listing, post page, tag pages, RSS
feed and JSON-LD all derive from the `blog-posts` collection. No template
edits are ever needed.

## Map

```
blog/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/post.ts       # Zod schema for `blog-posts`
├── content/posts/*.md    # the posts
├── lib/
│   ├── domain.ts         # date format, tag href helper (pure)
│   ├── posts.ts          # publishedPosts / tagCounts (single source of truth)
│   └── rss.ts            # the feed builder (exposed at /rss.xml)
├── components/
│   ├── PostCard.astro    # listing card (tags linked)
│   └── Comments.ts       # island: lazy Giscus loader
└── pages/
    ├── Index.astro       # /blog/
    ├── PostDetail.astro  # /blog/{slug}/
    └── TagIndex.astro    # /blog/tag/{tag}/
```

Route wiring: `src/pages/blog/{index,[slug].astro,tag/[tag].astro}` plus
`src/pages/rss.xml.ts` (re-exports the module's `GET`).

## Frontmatter

```yaml
title, slug (matches filename), date (YYYY-MM-DD), updated?, excerpt,
tags: [kebab-case…], author, coverImage? (path under /assets/images/blog/),
comments: false (opt-in Giscus), draft: false (excludes everywhere)
```

## Comments (Giscus)

- Posts opt in with `comments: true`; only then does the page render the
  comments section at all.
- The `Comments` island loads Giscus **only when the section scrolls into
  view** (IntersectionObserver, 200px margin); zero cost for readers who
  never reach the bottom.
- The app config lives in `SITE.giscus` (src/config/site.ts). While it is
  empty the island renders a friendly "coming soon" note instead; fill
  repo/repoId/category/categoryId from https://giscus.app once GitHub
  Discussions are enabled on the repository.

## RSS

`/rss.xml` (built by `lib/rss.ts` via `@astrojs/rss`) carries every published
post with tags as categories. BaseLayout adds the autodiscovery
`<link rel="alternate">` on every page while the blog module is enabled.
Disabling the module 404s the feed.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from every
registry surface, routes redirect home, the feed 404s, and the autodiscovery
link disappears from all pages.

## Cross-module link rule for post bodies

Markdown bodies may link to **module listings and fixed routes**
(`/mind/pranayama/`, `/body/meals/planner/`, `/quiz/`, `/rss.xml`, …) and to
**same-module detail pages**, but never to *another module's* detail pages
(`/mind/mantras/{slug}/`, `/wiki/{category}/{slug}/`, …). Listings survive
that module being disabled (they become redirects); detail pages do not, so
a cross-module detail link would break the build when only the *other*
module is switched off. The `check-links` gate enforces this in practice.

## Adding an entry

Copy `content/post-template.md` to `content/posts/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the listing, tags, RSS and search index all derive from the collection.
