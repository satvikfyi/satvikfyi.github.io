# Wiki module (Phase 4, sitewide)

The knowledge base at `/wiki/`, scriptures, books, deities, worship methods
and concepts. **Authoring an article = adding one markdown file with a
category**; the alphabetical index, category page, article page, related
links and backlinks all derive from the `wiki-articles` collection.

## Map

```
wiki/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/article.ts    # Zod schema for `wiki-articles`
├── content/articles/*.md # the articles
├── lib/
│   ├── domain.ts         # the five fixed categories + href helpers
│   └── articles.ts       # alphabetical order, slug map, backlinks
├── components/ArticleCard.astro
└── pages/
    ├── Index.astro        # /wiki/, alphabetical index + categories
    ├── CategoryIndex.astro# /wiki/{category}/
    └── WikiArticle.astro  # /wiki/{category}/{slug}/
```

Route wiring: `src/pages/wiki/{index,[category]/index,[category]/[slug]}.astro`.

## Cross-references

- `related: [slugs…]` in frontmatter lists other wiki articles; the article
  page resolves each slug through the build-time map and renders it as a
  link **with the target's correct category in the URL**.
- **Backlinks** are computed, not authored: the article page finds every
  article whose `related` includes it and renders them as "Mentioned in"
  chips.
- A `related` slug with no matching article renders nothing, but any *link
  that does render* is a real file in `dist/`, so `check-links` fails the
  build on stale references. That is the validation.

## Content rules

- One of the five fixed categories (scriptures, books, gods, worship,
  concepts), extend `lib/domain.ts` if a sixth is ever truly needed.
- `references[]` is required (min 1): scripture as scripture, modern books
  as modern books, the site's governance rule.
- IAST transliteration for Sanskrit terms, per site convention.

## Disabling

Set `enabled: false` in `module.config.ts`: the module vanishes from every
registry surface and its routes redirect home. Other pages' links to wiki
articles are plain URLs (they resolve to the redirect), and any
registry-guarded links disappear.

## Cross-module link rule for article bodies

Same rule as the blog: bodies link to listings and fixed routes across
modules (`/body/yoga/`, `/mind/mantras/`, …) and to detail pages **only
within the wiki**, wiki detail links vanish together with the module, so
they can never break another module's build. `check-links` is the gate.

## Adding an entry

Copy `content/article-template.md` to `content/articles/{slug}.md`, rename the copy
to the slug, and fill in every field (the template's comments list the enum
values and the YAML gotchas: quote dates, verse numbers and anything with a
colon). Nothing else changes; the alphabetical index, category pages, related/backlinks and search index all derive from the collection.
