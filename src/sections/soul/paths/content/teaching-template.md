---
# Soul teaching template, copy into content/teachings/{slug}.md and rename
# the copy to match the slug. Lives outside teachings/ on purpose. Must
# satisfy schemas/teaching.ts; the build fails otherwise.
#
# A teaching is a scriptural passage: verse in IAST (where Sanskrit),
# translation, and a reflective essay as the body. It renders on its path
# module's overview page under "From the tradition".

title: "Acting without claiming the fruit"
slug: acting-without-claiming-the-fruit   # kebab-case; MUST equal the file name
path: action                       # action | knowledge | devotion | meditation | tantra
summary: "One sentence for the teaching card."

scripture: "Bhagavad Gītā"          # the text it comes from
# QUOTE the reference if it looks like a bare number ("2.47"), or YAML
# parses it as a float and the build fails. Words are fine unquoted.
reference: "2.47"
sanskrit: "karmaṇy-evādhikāras te mā phaleṣu kadācana"   # IAST verse, optional for prose teachings
translation: "Your right is to the action alone, never to its fruits."

sources:
  - title: "Bhagavad Gītā"
    author: "Vyāsa (traditional attribution)"
  # - title: "Translation & commentary"
  #   author: "S. Radhakrishnan"
---


The reflection (this body): 2–4 short paragraphs interpreting the passage,
clearly the site's own voice, never presented as scripture. Markdown
allowed.
