---
# Wiki article template, copy into content/articles/{slug}.md and rename
# the copy to match the slug. Lives outside articles/ on purpose. Must
# satisfy schemas/article.ts; the build fails otherwise.
#
# Cross-references are slugs of OTHER wiki articles (any category). The
# article page renders them as links and computes the reverse direction
# ("Mentioned in") automatically. A related slug that does not exist is
# silently dropped, but any link that renders must resolve, which is how
# stale references fail the link check.

title: "Dharma"                     # quote anything containing a colon
slug: dharma                        # kebab-case; MUST equal the file name
category: concepts                  # scriptures | books | gods | worship | concepts
summary: "One or two sentences for the card and search description."

# Optional: slugs of related articles; keep them reciprocal where natural.
related:
  - karma
  # - moksha

# At least one reference required: scripture as scripture, modern books as
# modern books. Quote values containing colons or verse numbers.
references:
  - title: "The Mahābhārata & Bhagavad Gītā"
    reference: "dharma as the epics' central problem"
  # - title: "The Laws of Manu"
  # - title: "Darśan: Seeing the Divine Image in Hinduism"
  #   author: "Diana Eck"
---


The article body, Markdown, 3–5 short paragraphs. Structure that works:
an opening definition in plain language, "## What it is/teaches/carries",
and "## Where to start" or "## On this site" for connections to the live
modules. IAST for Sanskrit terms, satvik with exactly that spelling, and
links to module listings (not other modules' detail pages).
