# Wiki module (Phase 4, sitewide)

The site's unified knowledge base at `/wiki/`: scriptures, books, deities,
worship methods, concepts, **ingredients** and **cooking techniques**
(docs/unified-wiki.md — modules own practice, the wiki owns meaning).
**Authoring an article = adding one markdown file with a category**; the
alphabetical index, category page, article page, related links and
backlinks all derive from the `wiki-articles` collection.

## Map

```
wiki/
├── module.config.ts      # manifest (registered in src/config/sections.ts)
├── schemas/article.ts    # Zod schema for `wiki-articles`
├── content/articles/*.md # the articles
├── lib/
│   ├── domain.ts         # categories, dravya vocabularies + href helpers
│   └── articles.ts       # alphabetical order, slug map, backlinks
├── components/ArticleCard.astro
└── pages/
    ├── Index.astro        # /wiki/, alphabetical index + categories
    ├── CategoryIndex.astro# /wiki/{category}/
    └── WikiArticle.astro  # /wiki/{category}/{slug}/
```

Route wiring: `src/pages/wiki/{index,[category]/index,[category]/[slug]}.astro`.

## Ingredients & the recipe bridge

- Ingredient entries carry `ingredientItem` — the **canonical name from
  `content/recipes/ingredients.json`**, spelled exactly. That field is the
  join key for both directions of the recipe ↔ wiki link (implemented in
  `src/shared/lib/ingredientBridge.ts`, consumed by this module and the
  meals module):
  - **Forward**: recipe pages link each ingredient item that has an entry
    to `/wiki/ingredients/{slug}/`; items without entries stay plain text.
  - **Backward**: ingredient entries render "Used in N recipes" from one
    inverted map computed per build.
- The optional `dravya` frontmatter object (strict enums, kept in sync
  with the ayurveda module's vocabularies) renders an āyurvedic profile
  table — the ghee rule: one entry, kitchen and ayurveda sections inside.
- Naming conventions: alt-names (sendha namak, saindhava) live in the
  body prose — Pagefind makes them searchable for free. Sibling forms
  cross-link via `related[]`. A divine form gets its own entry titled
  with the honorific ("Tulsi Devi"), cross-linked to the ingredient
  entry.
- 15 former ayurveda-module entries were converted (2026-09-11); their
  old URLs render soft-redirect stubs via that module's `movedTo` field
  (canonical to the wiki entry, excluded from the search index). The 5
  medicinal herbs stayed in `/body/ayurveda/`.

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
