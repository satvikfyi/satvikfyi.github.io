---
# Ayurveda entry template, copy into content/entries/{slug}.md and rename
# the copy to match the slug. Lives outside entries/ on purpose so it never
# becomes a page. Must satisfy schemas/entry.ts; the build fails otherwise.

name: "Turmeric"                   # common English name
slug: turmeric                      # kebab-case; MUST equal the file name
sanskritName: "Haridrā"            # IAST, optional for non-Sanskrit items
kind: herb                         # herb | ingredient
summary: "One or two sentences for the card and search description."
partUsed: "Rhizome (fresh or dried powder)"

# One or more of the six tastes: sweet | sour | salty | pungent | bitter | astringent
tastes:
  - bitter
  - pungent

# Each dosha: balancing | neutral | aggravating
doshaEffects:
  vata: balancing
  pitta: aggravating
  kapha: balancing

# One or more of the controlled vocabulary: heating | cooling | light |
# heavy | oily | dry | sharp | mild | mobile | grounding
# (extend lib/domain.ts if a genuinely common guṇa is missing)
properties:
  - heating
  - light

# Traditional uses, phrased as tradition ("traditionally used for…"),
# never as treatment claims.
indications:
  - "Traditional wound and skin herb (vraṇa-ropana)"
  - "Kindles digestion (dīpana)"

# Honest cautions; interactions, pregnancy, conditions. Never soften.
contraindications:
  - "Gallstones or bile-duct obstruction"
  - "High-dose extracts with anticoagulants, consult a physician"

# How it is traditionally prepared/taken. Multi-line values containing a
# colon must be double-quoted (see below); fold lines with two-space indents.
preparation: "In the kitchen: ¼–½ tsp cooked into dal or rice. As golden
  milk: simmer in milk with pepper and jaggery."

# At least one source; classical texts with chapter/verse where you are
# confident of the locator, else name the text only. Quote colons/verse
# numbers.
sources:
  - title: "Bhāvaprakāśa Nighaṇṭu"
    author: "Bhāvamiśra"
  # - title: "Ayurvedic Cooking for Self-Healing"
  #   author: "Vasant Lad & Usha Lad"
---


Optional "In the tradition" paragraph: the entry's story, its household
place, or a note distinguishing classical claims from modern reading.
