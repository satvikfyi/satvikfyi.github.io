---
# Pranayama technique template, copy into content/techniques/{slug}.md and
# rename the copy to match the slug. Lives outside techniques/ on purpose.
# Must satisfy schemas/technique.ts; the build fails otherwise.
#
# SAFETY IS STRUCTURAL HERE: contraindications requires at least one entry
# for EVERY technique, and requiresTeacher: true flags practices that must
# be learned under supervision (a prominent warning renders automatically).

name: "Alternate Nostril Breathing"
slug: alternate-nostril-breathing   # kebab-case; MUST equal the file name
sanskritName: "Nāḍī Śodhana Prāṇāyāma"  # IAST
category: balancing                 # calming | balancing | energizing | cooling | cleansing
level: beginner                     # beginner | intermediate | advanced
summary: "One or two sentences for the card and search description."

benefits:
  - "Settles the whole system"

# MANDATORY, at least one honest caution. If a technique is broadly safe,
# say for whom extra care applies rather than shipping an empty list.
contraindications:
  - "Do not force retention in the early stages"

steps:
  - "One instruction per step, imperative voice."
  - "Second step."

# Counting pattern, plain language, quote if it contains a colon.
rhythm: "Begin 1:0:1 (inhale and exhale equal, no hold)"
durationGuidance: "5–10 minutes daily; 5–9 rounds to begin."

# 1–3 doshas the technique traditionally helps balance.
associatedDoshas:
  - vata
  - pitta

# true ONLY for practices the tradition insists are learned from a teacher
# (e.g. bhastrīka). Renders a prominent warning banner automatically.
requiresTeacher: false

# Optional free-video guide; verify before adding, cite again in sources.
# videoUrl: https://www.youtube.com/watch?v=…

sources:
  - title: "Haṭha Yoga Pradīpikā"
    author: "Svātmārāma"
    reference: "chapter 2, verses 7–10"
  # - title: "Light on Pranayama"
  #   author: "B. K. S. Iyengar"
---


Optional "In the tradition" paragraph: the technique's classical context,
its name's meaning, or which constitutions it suits and why.
