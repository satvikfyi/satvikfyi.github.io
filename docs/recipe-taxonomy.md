# Recipe taxonomy & frontmatter v2

How the recipe collection is organized and which fields each recipe file
carries, designed for the moment the site grows from 51 family recipes to
51 + 100 temple recipes + non-satvik family food. Grounded in the research
memo on satvik temple gastronomy (faceted classification, kachha/pakka
dichotomy, shaucha tiers, liturgical calendar) and in what is already
built: the meals module, `ingredients.json`, and the 100-recipe catalog.

## The problem, in one paragraph

The current schema classifies along four facets — `mealType`, `satvikTags`,
`doshaEffects`, `seasonalSuitability` — all Western-meal or ayurvedic
frames. The 100 temple recipes expose the gap: 65 of them are stamped
`mealType: lunch` because that field cannot say "this is a rice offering,
a dal, a tiffin, a sweet". Everything that makes a temple recipe itself —
which shrine, which sampradaya, which festival, how strict the botanical
canon, whether it travels — currently lives in free text (`sources`,
`dietNotes`, the body paragraph), invisible to filters, search, and
schema.org. And the family keeps non-satvik favourites in the same pile.
We need to organize all three foodways without splitting the collection
into a folder tree nobody can maintain.

## The stance (decisions, not suggestions)

1. **Facets live in frontmatter, not in folders.** One recipe = one file
   = one slug = one canonical URL (`/body/meals/recipes/{slug}/`). All
   grouping — by dish type, region, temple, festival, strictness — is
   derived at build time. No `content/recipes/sweets/` folders, no
   duplicate entries under multiple categories. This is the research
   memo's central point (monohierarchies fail; facets scale) and it is
   also the cheapest option: the shopping list, planner pool, review
   workflow, and SEO all keep working unchanged.
2. **`content/recipes/` is the archive; the website collection is what
   is hosted; non-satvik is never hosted.** (Boundary clarified
   2026-09-10.) The archive keeps `satvik/` (the 51 family recipes),
   `non-satvik/` (personal-use recipes, excluded from hosting by
   policy), and `recipes_new/` (the 100 temple recipes with their
   catalog and generation scripts). The hosted collection —
   `website/20260910/src/sections/body/meals/content/recipes/` — is
   flat and satvik-only; its recipes carry `foodway: temple | home`
   (the 100 stamp `temple`, the 51 `home`) so "Temple classics" vs home
   cooking stays browsable without folders, and no folder ever leaks
   into URLs.
3. **Derive, don't duplicate.** Anything computable from
   `ingredients.json` is computed by the audit script, never hand-tagged:
   strictness (new-world botany flags), dairy/gluten tags (aisle
   membership), vrat safety (grain/pulse/salt rules). Hand-set values the
   audit can verify — never values the audit must take on faith. This is
   the same pattern that made `ingredients.json` work.
4. **Controlled vocabularies in `lib/domain.ts`**, exactly like
   `SATVIK_TAGS` today: enums render filter options statically and the
   build fails on an unknown value. Growing a vocabulary = appending one
   line, documented like adding an ingredient.
5. **Filters are query params on the one listing page**
   (`/body/meals/?dish=dal&temple=udupi&occasion=janmashtami`), rendered
   by the existing island pattern, deep-linkable, no-JS fallback shows
   everything. Per-facet landing pages (`/body/meals/collections/…`) are
   a later SEO decision, not a data-model decision; when they come, they
   are generated from the same fields and the recipe URL stays canonical.
6. **Everything new is optional-with-default** except `dishType`. The 51
   live files and 100 staged files must build green the day schema v2
   lands, with zero content edits; values get stamped in a migration
   pass afterwards.

## Facet map: research → what exists → what changes

| Research facet | Today | v2 |
| --- | --- | --- |
| 1. Culinary typology (Pāka) | `mealType` (breakfast/lunch/dinner/snack) — collapses (65× lunch) | **`dishType`** (new, required) — the functional anatomy; `mealType` stays for the planner, demoted in the listing |
| 2. Sacred geography (Kshetra) | free text in `sources` | **`region`** + **`tradition`** + **`temple`** (all optional enums) |
| 3. Canonical strictness (Shaucha) | nothing structured | **`strictness`** (sanctum / classical / adapted; non-satvik exists only in the archive, never hosted), audit-verified against ingredients |
| 4. Liturgical calendar (Kāla) | nothing | **`occasions[]`** (enum array, default `daily`); fasting folded into tags as `vrat` |
| 5. Ingredient matrix | **already solved** — `ingredients[].item` + `ingredients.json` aisles | no new fields; expose aisle filtering later, derive never re-tag |
| — (bonus) Kachha/Pakka stability | nothing | **`keeps`** (same-day / few-days / weeks) — the sankhudi/nisankhudi line, answers "can I carry this as prasadam?" |

## Field specification

### `dishType` — required enum, the one mandatory addition

The dish's role on a thali / bhoga plate. The catalog's ten batch
categories map onto this almost 1:1, so the migration of the 100 is a
table lookup, not a judgment call.

| Value | Label | Covers |
| --- | --- | --- |
| `rice` | Rice dishes | pulao, puliyodharai, pushpanna, kanika, thengai/ellu sadam |
| `khichdi` | Khichdi & pongal | kitchari, ven pongal, geeli chana dal khichari |
| `dal` | Dals & sambar | dalma, saaru, tovve, sambar, split-mung dal |
| `soup` | Rasams & soups | milagu rasam, ash-gourd soup, whole-mung soup |
| `sabzi-dry` | Dry sabzis & poriyals | poriyal, bhaji, sukhi arbi, annakoot sabzi |
| `sabzi-wet` | Gravies & kootus | besara, mahura, korma, aviyal, kofta & paneer curries |
| `tiffin` | Tiffin & fritters | idli, dosa, vada, upma, cheela, kotte kadubu, vada-pav |
| `bread` | Breads | paratha, phulka, puri |
| `porridge` | Porridges | daliya, oatmeal |
| `sweet` | Sweets & confections | laddu, khaja, mysore pak, panchamirtham |
| `kheer` | Kheer & payasam | akkara vadisal, payasam, milk puddings |
| `condiment` | Chutneys & relishes | chutneys, pachadi, raita, kosambari sides |
| `salad` | Salads | kosambari, sprout bowls, cucumber salad |
| `drink` | Drinks | badam milk, takra |

Labels carry the indigenous gloss where it exists — *Anna/Bhat* (rice),
*Khechudi* (khichdi), *Dali* (dal), *Tarkari* (sabzi), *Panyaram*
(tiffin), *Mithai/Pitha* (sweet), *Payasam* (kheer), *Khatta/Pachadi*
(condiment) — the research's dual-naming applied at the vocabulary
level, not per recipe. A separate `nectar` value (panchamrit) was
proposed in review and declined: Palani panchamirtham is a dense
preserve, so `sweet`; liquid panchamrit/charanamrit remain wiki
articles, not recipes. The dry/wet sabzi split stays despite review
suggestion to merge — gravy vs dry changes thali planning and `keeps`,
and the corpus exercises both halves heavily. Prune values the corpus
never uses after migration — the audit reports per-value counts, and a
vocabulary nobody exercises is noise.

### `foodway` — enum, stamped automatically from the master folder

| Value | Meaning | Origin |
| --- | --- | --- |
| `temple` | traced to a shrine, matha, or haveli canon (naivedyam food) | the 100 (archived in `recipes_new/`) |
| `home` | satvik home cooking — notebook, seeded, book-sourced (Lad, etc.) | the 51 (archived in `satvik/`) |

A third foodway exists only in the archive: `non-satvik/` holds family
favourites with onion/garlic for personal use — **never hosted**; that
is settled policy, not an open question, so the website schema has no
`family` value at all.

`strictness` and `foodway` overlap deliberately; they answer different
questions. Foodway says *whose dish this is* (browse "Temple classics"
vs home cooking); strictness says *how pure it is* (badges). An ISKCON
book recipe is `foodway: temple` (haveli canon), `strictness:
classical`.

### `strictness` — enum, default derived from foodway, verified by audit

The research's shaucha tiers, plus an honest home ladder:

| Value | Label | Badge | Rule (audit-enforced) |
| --- | --- | --- | --- |
| `sanctum` | Pre-Columbian sanctum canon | seal icon | no new-world ingredient at all (see flags below) |
| `classical` | Classical satvik | leaf icon | no alliums, no mushrooms; new-world veg allowed |
| `adapted` | Satvik-adapted | leaf icon | satvik version of a dish that originally had alliums |
| `non-satvik` | Family food, as-is | no badge | archive-only value; the website schema drops it because non-satvik is never hosted |

Audit mechanics: `ingredients.json` grows a `sanctumBarred: true` flag —
named for the rule it enforces, not the botany, because the exclusion
list is historical-canonical, not purely Columbian. Flagged items:

| Group | Items | Note |
| --- | --- | --- |
| New-world nightshades & chilies | potato, tomato, green/dry chilies, chili powders, capsicum | sanctum heat comes from maricha/pippali/ginger only |
| Other post-1500 crops | cauliflower, cabbage, green peas, maize, raw papaya, rajma, groundnut | |
| Old-world but canon-barred | bhindi (okra) | African, not Columbian — excluded as bideshi per the research |
| Post-1500 dairy technique | chhena, paneer | acid-curdling arrived with the Portuguese; archaic sweets are milk-reduction based |
| Tree nuts | cashew | see the exception below |

Deliberately **not** flagged: eggplant (native, canonical — Puri's own
dahi baigana carries it in this corpus).

The cashew exception is real and already live in the corpus:
`puri-kanika` and `puri-chhena-poda` contain cashews (`puri-potala-rasa`
mentions them only in prose, saying it manages *without* cashew paste).
Rather than soften the audit with an exception list, the tier
answers it — Tirupati laddu (cashew in the modern dittam) is `classical`,
and the two Puri recipes above are contested: chhena-poda is a modern
offering (chhena itself is post-1500) and should stamp `classical`;
kanika is either edited (archaic kanika has no cashew) or downgraded.
The audit failing them is the audit working: it surfaces exactly which
"sanctum" claims the corpus cannot support. Tier mapping to the
research: `sanctum` = Tier 1 (archaic pre-Columbian), `classical` =
Tier 2 (universal satvik, includes post-Columbian Agamic dittams),
`adapted` = Tier 2 variant, vrat (a tag, below) = Tier 3.

The cross-checks: a `sanctum` recipe using any `sanctumBarred` item
fails; a `classical`/`sanctum` recipe containing alliums fails; a
`satvik` tag on a `non-satvik` recipe fails. Hand-set value,
machine-verified — same trust model as canonical ingredient names.

### `region`, `tradition`, `temple` — optional enums (the geography facet)

| Field | Starting vocabulary | Used for |
| --- | --- | --- |
| `region` | `odia, tamil, karnataka, andhra, kerala, maharashtra, gujarat, rajasthan, bengal, north-indian, pan-indian` | filter + `recipeCuisine` |
| `tradition` | `odia-vaishnava, sri-vaishnava, madhva, gaudiya-vaishnava (ISKCON), pushtimarg, kaumara, smarta, none` | filter + `recipeCuisine` |
| `temple` | `jagannath-puri, tirumala-tirupati, srirangam, kanchipuram-varadaraja, azhagar-kovil, palani, udupi-krishna-matha, nathdwara-shrinathji, mysore-matha` | "browse by shrine" journeys, the research's strongest SEO story |

`temple` implies `region`/`tradition`; the audit can fill those from a
small lookup table in `domain.ts`, so recipes only state the shrine.
Omit all three for `foodway: family`/`home` dishes with no lineage.

### `occasions` — enum array, default `[daily]`

Start set: `daily, janmashtami, ganesh-chaturthi, govardhan-puja,
rath-yatra, makar-sankranti, pongal, margazhi, navratri, ekadashi,
diwali, shivaratri, onam, utsava` (utsava = generic temple festival,
covers kalyanotsava). Drives the "cook for the occasion" journey and
`keywords` in JSON-LD. Most values will be empty on most recipes; that
is fine, an occasion list is exactly where sparse data stays meaningful.

Fasting is **not** a strictness value: it is orthogonal to the botanical
ladder. A sabudana khichdi is grain-free and vrat-safe, yet sits
squarely inside classical satvik the rest of the year; forcing recipes
to pick `vrat` *or* `classical` loses that. So: add `vrat` to
`SATVIK_TAGS` (it renders as the research's flame badge and reuses the
existing tag filter). The audit suggests it — only rock/black salt
(plain `salt` disqualifies, per the family's 2026-09-11 salt decision:
three distinct products), no grains/pulses aisle items unless flagged
`vratOk` in `ingredients.json` (sabudana, kuttu, singhara) — and the
family confirms. Tags are chips; vrat is a chip. (An external review
proposed `vrat` inside the `strictness` enum and, in the same table, a
separate `fastingSafe` boolean — the second instinct is the right one;
the first contradicts it.)

### `keeps` — optional enum, default `same-day`

The kachha/pakka (sankhudi/nisankhudi) dichotomy, translated into the
question a devotee actually asks: *can I carry this to the temple, a
gathering, a trip?* `same-day | few-days | weeks`. Deep-fried, syruped,
and roasted things are `weeks` (khaja, laddu, panchamirtham — the
nisankhudi line); dals and wet curries `same-day` (sankhudi: abhada,
dalma, daddojanam); high-acid or oil-cooked grain dishes sit between
(pulihora, idli, dosai). Default `same-day`; the stamping pass sets it
by rule of thumb and the audit warns on suspicious combinations (a
ghee-fried sugar-syrup recipe marked `same-day`, a wet dal marked
`weeks`). This is the one genuinely new idea beyond the research's five
facets — externally reviewed as the direct operationalization of the
kachha/pakka boundary, so it stays in the schema; the family confirms
per-recipe values during batch review rather than deciding whether the
field should exist.

### `subtitle` — optional string

The research's dual-naming: canonical name as `title` ("Jagannath Puri
Dalma"), plain-English functional descriptor as `subtitle` ("Clay-pot
split-gram and native vegetable stew"). Renders under the title on cards
and detail pages, feeds OG description alongside `summary`. Skip the
native-script field; IAST + Noto fallbacks already cover the site's
romanization, and script entry is a maintenance burden the family
shouldn't carry.

### Not added (deliberately)

- **Daily seva times** (mangala/raja bhoga/sandhya) — prose for the
  temple essays, not a filterable facet for home cooks.
- **Dittam (temple batch sizes) and yield scaling** — `servings` already
  scales; a dedicated field would be decorative.
- **Panchamrit/charanamrit as data types** — wiki articles, not recipes.
- **Per-recipe ingredient tags** — the ingredient facet is fully derived
  from `ingredients[].item` × `ingredients.json`; tagging again would
  create a second source of truth.

## Build-time audit gates

Two gates, adopted from external review. With the boundary clarified
(2026-09-10) both gates apply to the **hosted website collection**
unconditionally: everything hosted is satvik by policy — `content/
recipes/` is strictly an archive and its `non-satvik/` folder never
reaches the site. In the archive the same checks warn instead of fail,
because archive files make no hosting claim.

**Gate 1 — satvik assertion, on the whole hosted collection.** The
build fails if a hosted recipe uses an ingredient flagged in
`ingredients.json` with `allium: true` (onion, garlic, shallot, chives,
leek, spring onion) or `tamasik: true` (mushrooms, alcohol/vinegar
derivatives, animal products beyond milk/ghee/honey). Today's live 51
pass this gate already — zero allium ingredients exist in the website
collection — so the gate hardens an existing invariant rather than
changing content.

**Gate 2 — sanctum authenticity, on `strictness: sanctum` only.** The
build fails if a `sanctum` recipe uses any `sanctumBarred` ingredient
(table above). `classical` is untouched — Tirupati laddu keeps its
cashews, ISKCON keeps its tomatoes.

Phasing: both gates run as warnings from the day the schema lands, and
flip to build-failures once the stamping pass and the family's batch
review have settled the contested recipes (open question 3).

## Schema v2 sketch (Zod, backward compatible)

```ts
export const DISH_TYPES = ['rice','khichdi','dal','soup','sabzi-dry',
  'sabzi-wet','tiffin','bread','porridge','sweet','kheer','condiment',
  'salad','drink'] as const;

export const recipeSchema = z.object({
  // … existing fields unchanged …
  dishType: z.enum(DISH_TYPES),                       // required, new
  foodway: z.enum(['temple','home','family']).default('home'),
  strictness: z.enum(['sanctum','classical','adapted','non-satvik']).default('classical'),
  region: z.enum(REGIONS).optional(),
  tradition: z.enum(TRADITIONS).optional(),
  temple: z.enum(TEMPLES).optional(),
  occasions: z.array(z.enum(OCCASIONS)).default(['daily']),
  keeps: z.enum(['same-day','few-days','weeks']).default('same-day'),
  subtitle: z.string().trim().optional(),
});
```

`mealType` stays required: the planner schedules breakfast/lunch/dinner
and that is its axis. `satvikTags` grows `vrat`. Labels and IAST for
every vocabulary land in `lib/domain.ts` next to the existing label
maps, so pages and islands share one source.

## JSON-LD (`lib/jsonld.ts`)

| Schema.org property | Fed by |
| --- | --- |
| `recipeCategory` | `dishType` label (+ occasion labels when present) |
| `recipeCuisine` | composed: region + tradition/temple, e.g. "Odia temple cuisine (Jagannath Puri)" — precise, per the research, not "Indian" |
| `suitableForDiet` | `VegetarianDiet` always; `LowFatDiet`-style extras only when defensible — there is no `HinduDiet` in core schema.org, so onion-free/garlic-free/vrat go in `keywords`, not invented types |
| `keywords` | occasions, tradition, temple, tags, strictness label |

## Migration plan

1. **Schema + vocabularies land first**, all-new-optional: build stays
   green with 151 untouched files. Template (`recipe-template.md`) and
   this module's README get the new fields with commented guidance.
2. **Stamp the 100 temple recipes by script** from the ready-made
   mappings: catalog Batch → `dishType`; source-title regex →
   `temple`/`region`/`tradition` (49 say "Canon", 10 "Rosaghara" — the
   provenance is regular enough to parse); `strictness` suggested by the
   ingredient audit (`sanctum` for the Puri/matha recipes with no
   `sanctumBarred` items — the three cashew-bearing Puri recipes come
   back flagged for the family's tier-or-edit decision); `keeps` by
   rule of thumb (ghee-fried/syruped → `weeks`, wet dals/curries →
   `same-day`, sour/oil grain dishes → `few-days`). Script writes
   suggestions, a review pass confirms — the ingredients-review.md
   pattern again.
3. **Stamp the 51 live recipes** — `foodway: home`, `dishType` via a
   mealType+title heuristic that gets ~80%, finished by hand in one
   batch review (they are already reviewing in batches of 5–8).
   `strictness` per the satvik-adaptation decisions already pending in
   that review.
4. **Archive organization stays as-is**: `satvik/`, `non-satvik/`, and
   `recipes_new/` keep their names and purpose — the archive is for
   provenance, not hosting. A satvik recipe becomes hosted by copying
   it into the website collection (the 100 were copied 2026-09-10);
   `non-satvik/` never is.
5. **Website UI**: filters gain dishType + a "lineage" select
   (temple/tradition rolled into one) + occasion; listing groups by
   `dishType` instead of mealType; strictness badges on cards; facet
   invalidation (selecting a temple greys out contradicting filters —
   the zero-result prevention the research asks for) as a polish item.
6. **Audit upgrades** in `content/scripts/audit-ingredients.py`:
   implement the two gates above (`allium`/`tamasik` flags, the
   `sanctumBarred` table, `vratOk` for the vrat suggestion), the
   `keeps` plausibility warning, `dishType` coverage report, and the
   unused-vocabulary report.

## Open questions (family review, AGREE/correct style)

1. `keeps` — the field exists (externally validated); confirm or correct
   the per-recipe values as they surface in batch review.
2. Strictness labels — is `sanctum` the right word for the pre-Columbian
   tier, or is "Puri canon" / "archaic" clearer?
3. **The two cashew-bearing Puri recipes** (`puri-kanika`,
   `puri-chhena-poda`) — stamp `classical` or edit
   the recipe to match the archaic canon? Also confirm chhena/paneer as
   `sanctumBarred`. This gates flipping Gate 2 from warn to fail.
4. `occasions` start set — anything the family cooks for that is missing
   (Karva Chauth? Aadi/month observances? Ganesha every-Tuesday?)

Resolved by the boundary clarification (2026-09-10): the archive keeps
its `satvik/`/`non-satvik/` folder names, and non-satvik recipes are
never hosted — so the website schema carries no `family` foodway and no
`non-satvik` strictness. Resolved by the ingredient review (2026-09-11):
the salt question — `salt`, `rock salt`, and `black salt` are three
distinct canonical items; the vrat audit keys off plain `salt` being
absent.

## External review round (2026-09-10)

A second-pass review of this proposal; disposition recorded so the
reasoning survives the conversation.

**Adopted**

- Two-tier build-time audit (Gates 1 and 2, above) — re-scoped from
  "whole site" to the publishing boundary, because the master content
  system intentionally holds non-satvik family recipes for personal use
  and the live website collection is already allium-free.
- The cashew nuance — and it went further than the reviewer knew: three
  Puri recipes in the corpus carry cashews and will trip Gate 2 as
  stamped (open question 3). No `newWorldException` list needed; the
  tier system absorbs it (Tirupati = classical).
- Eggplant explicitly not barred (the reviewer's hedge resolved: native
  brinjal is canonical, Puri's dahi baigana proves it in-corpus).
- Indigenous glosses on `dishType` labels; `keeps` validated with the
  kachha/pakka water-activity rationale, upgraded to
  stamped-with-audit-warnings.

**Adapted**

- The reviewer's summary table wanted `fastingSafe` as a separate
  boolean; kept as the `vrat` tag instead — same validation, free chip
  and filter UI. Their own table kept fasting out of `strictness` even
  while their prose put it in; the table was right.

**Rejected, with reasons**

- **"Not Approved: folders & foodway" / unified single folder with
  `isTempleCanonical`** — the objection appears to misread the design:
  the *website* collection is already flat with facets in frontmatter;
  the archive folders are the family's own organization (commit 3c94cc1:
  "a folder for non-satvik recipes too for personal use"). A boolean
  also loses the temple-vs-home distinction the taxonomy needs. The
  clarification settled the real question behind the objection: archive
  and hosted are different layers with different rules.
- **Removing `non-satvik` from the schema ("if the site is 100%
  Satvik")** — half right, and the clarification (2026-09-10) resolved
  it exactly that way for the *website* schema, which drops the value:
  non-satvik is never hosted. The *archive* keeps the recipes untouched,
  which the reviewer's version would have destroyed. Each layer got the
  half the reviewer was right about.
- **`vrat` inside the `strictness` enum** — conflates the botanical
  ladder with the fasting axis; a grain-free dish is also classically
  satvik the rest of the year. One enum value cannot hold both.
- **Splitting `dal` vs `stew`, merging the sabzi pair, adding `nectar`**
  — boundary churn (is sambar a dal or a stew?) against no user-visible
  gain; the dry/wet sabzi split earns its keep in thali planning and
  `keeps`; panchamirtham is a `sweet`.

## Status

Proposal, revision 3 (external review folded in; archive-vs-hosted
boundary clarified 2026-09-10: `content/recipes/` is strictly an
archive, the website collection is hosted, non-satvik is never hosted).
The 100 temple recipes were copied into the hosted collection on
2026-09-10 under the current (v1) schema; the fields below are the
planned v2 stamping, applied only after the open questions clear.
Field names and vocabularies are the stable part; UI grouping and badge
visuals can evolve after the data exists.
