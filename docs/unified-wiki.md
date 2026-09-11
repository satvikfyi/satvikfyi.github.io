# Unified wiki — the site's knowledge layer (proposal)

Supersedes `docs/kitchen-wiki.md` (2026-09-11): the family asked for
the wiki to be **unified across the whole site** — body, mind, soul —
with **two-way linking** between recipes and ingredient entries.
Revised the same day after three design questions from the family
(category ambiguity, ingredient forms, and the single-entry principle
for substances). Nothing here is implemented yet.

## What the wiki is today

One sitewide module at `/wiki/` with five categories (`scriptures`,
`books`, `gods`, `worship`, `concepts`), ~11 articles, each validated
by a Zod schema (`title`, `slug`, `category`, `summary`, `related[]`,
`references[]`) plus a markdown body in `ArticleLayout` prose.

Crucially, the wiki is **already two-way linked within itself**:
`related[]` slugs render as links on the article page, and
`lib/articles.ts → backlinksTo(slug)` computes the reverse direction
("articles that reference this one") at build time. Zero client
JavaScript — both directions are static HTML. The unification proposal
is an extension of this existing pattern across modules, not new
architecture.

## The unification principle

**Modules own practice; the wiki owns meaning.**

| Layer | Owns | Examples |
| --- | --- | --- |
| Modules (body/mind/soul) | the doing — instructions, plans, collections | recipes, poses, pranayama techniques, planners, paths |
| Wiki (sitewide) | the understanding — what a thing *is*, where it comes from | prasada, dharma, Gāyatrī, **tej patta**, **tadka** |

## Decision 1 — ambiguous categories get domain-qualified names

"Techniques" alone would collide with the pranayama module's
`pranayama-techniques` collection and with meditation/asana explainers
sooner or later. The rule:

- **New category slugs are unambiguous**: `cooking-techniques`, not
  `techniques` (`/wiki/cooking-techniques/tadka/`). `ingredients` is
  unambiguous by nature.
- **Cross-domain explainers live in `concepts`** (which already
  exists): "what is trāṭaka" or "what is vinyāsa" is a concept page
  that links to the module owning the practice — the wiki explains,
  the module instructs.
- If a third "techniques" domain ever appears, a `domain` chip field
  can be added then; not pre-built.

## Decision 2 — ingredient entries are per form, families link out

One entry per **canonical ingredient item** — that is what the recipe
linking joins on (recipes say `rock salt`, so `/wiki/ingredients/rock-salt/`
is the entry plain salt's cousin links to). Within an entry:

- **Alt-names in the body**: sendha namak / saindhava lavana belong in
  the rock salt entry's prose — Pagefind indexes the body, so searching
  "sendha namak" finds the rock salt entry with no extra machinery.
- **Sibling forms cross-link via `related[]`** (rock salt ↔ black salt
  ↔ salt) — the existing backlink machinery makes this two-way for
  free.
- **Family umbrella entries** ("Salt in the Indian kitchen") only when
  a family genuinely needs a shared story, and never on a slug that
  collides with a canonical item (`salt` is a canonical item; a family
  page would take e.g. `salts-of-the-indian-kitchen`). Start without
  umbrellas; the entries' cross-links carry the story.
- **Slug rule is derived, with an explicit escape hatch**: kebab of the
  canonical name minus its parenthetical gloss, and `ingredients.json`
  gains an optional `wikiSlug` override for the rare name whose natural
  slug is wrong. Overrides are exceptional and audit-reported, so the
  derived rule stays the default and never silently forks.

## Decision 3 — one entry per substance, sections inside (the ghee rule)

Earlier draft: separate wiki (culinary) and ayurveda-module (medicinal)
entries, cross-linked. **Dropped.** The family's instinct is right and
simpler: ghee is **one wiki entry** with sections — *In the kitchen*
(smoke point, storage, tadka medium) and *In ayurveda* (ghṛta, tastes,
dosha effects, agni/ojas role). One URL, one search result, one
article.

Mechanics: the wiki article schema grows an **optional structured
`dravya` object** — the fields the ayurveda module's entries already
carry, as **strict Zod enums reusing that module's existing controlled
vocabularies** (`TASTES`, `PROPERTIES`, `DOSHA_EFFECTS`), never free
strings, so the script-conversion of 15 entries cannot introduce typo
drift and the build fails on any violation. Citations ride along in the
article's `references[]`. `WikiArticle.astro` renders the object as a
*dravya profile* table section when present, reusing the existing
DoshaEffectChips UI. Markdown body carries the prose sections. No new
fields beyond what the corpus already carries.

Migration for the overlap — the ayurveda module's 20 entries split
three ways:

| Ayurveda entry | Becomes |
| --- | --- |
| Cooking substances also in `ingredients.json` (ghee, ginger, cumin, cardamom, coriander, turmeric, dates, honey, mung dal, basmati rice, sesame oil, fennel, amla, tulsi, takra) | wiki `ingredients` entry; ayurveda fields move into its `dravya` section (script-convertible, no rewriting) |
| Purely medicinal herbs (ashwagandha, brahmi, shatavari, licorice, triphala) | stay in the ayurveda module for now; a wiki home can come later if ever |
| — (future) | the ayurveda module pivots gradually to the *system*: doshas, agni, ojas, dravya-guna theory, rasayana, dinacharya — the wiki links to it for depth |

No deletion happens until the wiki entries exist and the ayurveda
pages redirect softly. Two stub flavors, deliberately different:

- **Disabled-module stubs** (existing pattern): meta-refresh +
  `noindex` — there is no equivalent target, so staying out of the
  index is correct. Pagefind exclusion comes for free: `BaseLayout`
  already puts `data-pagefind-ignore` on `<html>` for every noindex
  page.
- **Migration stubs** (ayurveda → wiki): meta-refresh +
  `<link rel="canonical" href="{new wiki URL}">` and **no `noindex`** —
  noindex and canonical are conflicting signals (search engines
  distrust a canonical on a page told not to index), and the canonical
  is what consolidates the old URL's equity onto the wiki entry. Since
  these stubs are not noindex, they need an **explicit search-exclusion
  flag** (BaseLayout prop → `data-pagefind-ignore`) so they never
  duplicate their target in Pagefind results.

Both flavors must render through the site's layouts; Astro config-level
`redirects` are ruled out because their generated pages bypass
BaseLayout and would leak into search with neither noindex nor
exclusion. True 301s are not possible on static GitHub Pages.

**The Tulsi precedent** (substance that is also sacred): the ingredient
entry `/wiki/ingredients/tulsi/` follows the ghee rule — kitchen and
ayurveda sections in one entry. The sacred entry is a separate
`gods`/`worship` page and **its title carries the honorific: "Tulsi
Devi"**, never bare "Tulsi" — reverence lives in the naming. The two
cross-link via `related[]`, backlinks closing the loop. General
convention: when a substance has a divine form, the divine entry's
title uses the tradition's honorific (Devi, Bhagavān, …); the
ingredient entry keeps the plain botanical/kitchen name.

## Two-way linking (unchanged from the previous draft)

All build-time, zero client JS, no backend — the same trick as
`backlinksTo()`.

**1. Recipe → wiki (forward, automatic).** The recipe detail page links
each `ingredients[].item` that has a wiki entry to
`/wiki/ingredients/{slug}/`. The join key is the **canonical ingredient
name** from `ingredients.json` — already audited to exactly one
spelling per grocery — so links can never drift from naming. Slug rule:
kebab of the canonical name minus its parenthetical gloss
(`hing (asafoetida)` → `/wiki/ingredients/hing/`). Items without an
entry render as plain text, so the site launches with partial coverage
and fills in silently as entries are written.

**2. Wiki → recipes (backward, computed).** Each ingredient entry
renders "Used in N recipes" by scanning the meals collection for that
canonical item at build — the cross-module generalization of
`backlinksTo()`. The scan runs as **one inverted map per build**
(item → recipe list, built once in `ingredientBridge.ts` and shared by
every entry page), never per entry, so growth in recipes or entries
stays linear.

**3. Wiki ↔ wiki (exists today).** `related[]` + backlinks, unchanged.

Pagefind already indexes the whole rendered site, so every wiki entry
is searchable the day it ships.

## Implementation sketch

```
sitewide/wiki/schemas/article.ts       # + optional dravya object (decision 3)
sitewide/wiki/lib/domain.ts            # + 'ingredients', 'cooking-techniques' categories
sitewide/wiki/lib/ingredientBridge.ts  # canonical name → wiki slug; recipesUsing(item)
sitewide/wiki/pages/WikiArticle.astro  # dravya table + "Used in N recipes" sections
body/meals/pages/RecipeDetail.astro    # ingredient line renders as <a> when an entry exists
```

Recipe markdown untouched. The ingredient audit can later grow a nudge:
warn when a canonical item used by 20+ hosted recipes still has no
wiki entry.

## Build order

1. Categories + schema (`dravya` optional) + the bridge helpers.
2. Seed ~30 ingredient entries (salt family per decision 2, tej patta,
   hing, sonth, ghee per decision 3, panch phoron, tamarind,
   ambula/amchur, jaggery/kalkandu, coconut products, the rices, the
   moongs) and ~10 cooking-technique entries.
3. Forward links on recipe detail pages; "Used in N recipes" backlinks.
4. Script-convert the 15 overlapping ayurveda entries into `dravya`
   sections; soft-redirect the old ayurveda pages.
5. Grow opportunistically; fold recurring recipe `note:` explanations
   into entries as they get written.

## Status

**Executed 2026-09-11** (two external review rounds and three family
decisions are folded into the rules above; their history lives in the
session record, not here). Shipped: the two categories, the optional
`dravya` schema section with strict enums, the ingredient bridge
(derived slugs, audit-visible overrides, one inverted map per build),
forward links from recipe ingredient lists, "Used in N recipes"
backlinks on ingredient entries, seeded ingredient and
cooking-technique entries, and the script-conversion of the 15
overlapping ayurveda entries into wiki `dravya` entries with
soft-redirect stubs at the old URLs (canonical to the wiki entry, out
of the search index). The ayurveda module keeps the 5 medicinal herbs
and pivots gradually toward system entries. (The recipe-listing sort
added 2026-09-11 — alphabetical default, `?sort=` deep links — is
unrelated and already shipped.)
