---
# Meditation practice/concept template, copy into content/practices/{slug}.md
# and rename the copy to match the slug. Lives outside practices/ on
# purpose. Must satisfy schemas/practice.ts; the build fails otherwise.

name: "Mindfulness of Breath"       # display name
slug: mindfulness-of-breath         # kebab-case; MUST equal the file name
sanskritName: "Ānāpānasati"        # IAST, optional (some entries have none)
kind: practice                      # practice (how-to) | concept (philosophy)
summary: "One or two sentences for the card and search description."
tradition: "Buddhist ānāpānasati; adopted across the yoga traditions"

# For practices: how to do it. For concepts: how to explore it in
# experience (the page relabels the heading automatically).
steps:
  - "One instruction per step, imperative voice."
  - "Second step."

# Effects traditionally reported or reasonably expected.
effects:
  - "Settles attention on one always-available object"

# Optional honest cautions (trauma-sensitive notes, etc.). List items
# containing a colon must be double-quoted.
precautions:
  - "Watching the breath can make some people feel short of breath"

# How long / how often; empty string for purely conceptual entries.
durationGuidance: "Start with 10 minutes daily"

sources:
  - title: "Ānāpānasati Sutta"
    author: "the Buddha (Majjhima Nikāya 118)"
  # - title: "Yoga Sūtras of Patañjali"
  #   reference: "sūtra 1.33"
---


The main body: for practices, what the practice is and what a first month
feels like; for concepts, the idea unfolded in plain language. Markdown
allowed. End with where the entry sits among the others.
