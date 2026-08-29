# Recipe Review Plan

How the family gradually goes over the 51 recipes in the meals module and
corrects them to taste. This is the working agreement between the family
(who know the dishes) and whoever maintains the site (AI sessions or
otherwise, who know the files).

## Status tracking (already wired in)

Every recipe carries a `reviewStatus` frontmatter field:

- `draft` (default), the page shows a **"Newly added"** badge on its
  detail page until reviewed.
- `reviewed`, the badge disappears; the recipe is family-approved.

Nothing else changes when a recipe flips to `reviewed`, one line in its
markdown file (`reviewStatus: reviewed`), which the maintainer applies.

## Review order (batches of 5–8, ~30 minutes each)

Review in this order, notebook recipes first (they were transcribed from
handwriting and need the most eyes), originals second:

| # | Batch | Recipes |
| - | ----- | ------- |
| 1 | Notebook breakfasts | mixed-sprouts-bowl, besan-cheela, pudla, plain-dosa-potato-masala, rava-dosa, sabudana-khichdi, aloo-paratha |
| 2 | Notebook dals & rice | amti, dal-tadka, misal, steamed-rice, ghee-rice |
| 3 | Notebook mains & snacks I | dum-aloo, veg-dum-biryani, vada-pav, medu-vada |
| 4 | Notebook snacks & sweets | cucumber-raita, mint-chutney, tomato-chutney, dahi-pachadi, mango-ice-cream, mysore-pak, paneer-chilli, gobi-manchurian |
| 5–9 | Original breakfasts/lunches/dinners/snacks | the 27 seeded recipes, same meal-type groupings |
| 10 | Cross-cutting pass | dosha tags against docs/ayurvedic-classification.md, seasons, sources |

## The review session (each batch)

1. **Open the site**, `npm run dev` from `website/20260822/`, then browse
   `/body/meals/` and use the filters to see only the batch (or just open
   the recipes from the listing).
2. **Read each page as a cook, not an editor**; would this recipe, cooked
   exactly as written, come out right in your kitchen? That is the bar.
3. **Send corrections in any form.** Structured is fastest, free-form is
   fine. For example:

   ```
   Misal, goda masala is 2 tsp not 1; we use oil not ghee; also add a note
   that Amma made it for Diwali morning.
   Medu vada, soak overnight, not 4 hours.
   Amti, dosha tags wrong, it aggravates pitta in our experience.
   ```

   Stories and provenance notes ("Aaji's recipe", "festival food") are
   especially welcome, they become the "In the tradition" paragraph.
4. **The maintainer applies changes**, runs `npm run verify`, flips
   `reviewStatus: reviewed` for approved recipes, and pushes. The badge
   disappears.

## What to look for, in priority order

1. **Method authenticity**, steps that would not produce the dish.
2. **Quantities**, your kitchen's actual proportions.
3. **Names and framing**, dish names, family terminology, summaries.
4. **Dosha effects & seasons**, checked against
   docs/ayurvedic-classification.md (and your own judgement, which wins).
5. **Sources**, corrections to citations, family attribution wording.
6. **Satvik adaptations**, confirm which onion/garlic adaptations should
   stand and which dishes should remain "as-is family food".

## Editorial conventions (keep the collection coherent)

- Ingredient names reuse the canonical spellings (`ghee`, `moong dal
  (split yellow)`, …) so the planner's shopping list keeps grouping them; 
  new ingredients get added to the canonical set in the same style.
- Quantities parse as `amount unit` (`1 cup`, `½ tsp`) so the shopping
  list can sum them.
- Any field value containing a colon gets quoted in the YAML, otherwise
  the build fails (by design; it has caught us three times).
- One recipe = one file = `content/recipes/{slug}.md`; nothing else needs
  touching to publish it.
