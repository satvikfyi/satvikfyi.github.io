---
# Recipe template for the HOSTED collection: copy into
# content/recipes/{slug}.md (this folder), rename the copy to match the
# slug, and fill in every field. This file itself lives outside the
# recipes/ folder on purpose: the content-collection loader only reads
# content/recipes/**/*.md, so a template there would become a (broken) page.
#
# Hosting policy: satvik only — no onion, garlic, or mushroom
# ingredients, ever. Non-satvik family recipes are archived in the
# repository at content/recipes/non-satvik/ and are never hosted.
#
# Everything below must satisfy schemas/recipe.ts, the build fails on any
# violation, which is the quality gate working as designed. Comments after
# "#" are YAML comments and safe to leave in.

title: "Recipe Title"           # quote anything containing a colon
slug: recipe-title              # kebab-case; MUST equal the file name
summary: "One or two sentences for the card and search description."
mealType: lunch                 # breakfast | lunch | dinner | snack
prepTime: 10                    # minutes, whole number
cookTime: 20                    # minutes, whole number (0 is allowed)
servings: 2                     # 1–12

# Pick from: satvik, tridoshic, light, warming, cooling, fresh-cooked,
# dairy, gluten-free, protein-rich, no-onion-garlic
satvikTags:
  - satvik
  - no-onion-garlic

# Each dosha: balancing | neutral | aggravating
doshaEffects:
  vata: neutral
  pitta: neutral
  kapha: neutral

# Pick from: spring, summer, monsoon, autumn, winter, all-year
seasonalSuitability:
  - all-year

dietNotes: "Optional, substitutions, fasting notes, pantry tips."

# At least one source is required. For notebook/family recipes use the
# honest provenance marker; for classical or book recipes cite properly.
sources:
  - title: "Family recipe notebook"
  # - title: "Ayurvedic Cooking for Self-Healing"
  #   author: "Vasant Lad & Usha Lad"
  # - title: "Charaka Samhita"
  #   reference: "Sūtrasthāna 27: mudga among the wholesome pulses"

# Reuse canonical item names already in other recipes (ghee, ginger,
# coconut (fresh grated), moong dal (split yellow), …) so the
# planner's shopping list groups them. Quantity must read as
# "amount unit" (1 cup, ½ tsp, 2 tbsp, 200 g, 1 inch piece) for the
# shopping list to sum it: or a note like "to taste". Plain counts may
# stay unquoted (quantity: 6).
ingredients:
  - item: "ingredient name (canonical, e.g. ghee)"
    quantity: "1 cup"
    note: "optional prep note"

steps:
  - "One instruction per step, imperative voice."
  - "Second step."
---


Optional "In the tradition" paragraph: where the recipe came from, margin
notes from the notebook, or a line on why the tradition cooks it this way.
Markdown is allowed here (the frontmatter above is data; this body is prose).
