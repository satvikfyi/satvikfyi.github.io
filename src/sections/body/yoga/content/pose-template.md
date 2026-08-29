---
# Pose template, copy into content/poses/{slug}.md, rename the copy to match
# the slug, and fill in every field. This file lives outside poses/ on
# purpose: the collection loader only reads content/poses/**/*.md, so a
# template inside would become a (broken) page.
#
# Everything must satisfy schemas/pose.ts; the build fails on any violation.
# Comments after "#" are YAML comments and safe to leave in.

name: "Mountain Pose"             # common English name
slug: mountain-pose                # kebab-case; MUST equal the file name
sanskritName: "Tāḍāsana"          # IAST transliteration, always with diacritics
category: standing                 # standing | balance | forward-bend | backbend | twist | inversion | seated | meditative | supine | restful
level: beginner                    # beginner | intermediate | advanced
summary: "One or two sentences for the card and search description."

# 3–5 entries, benefits phrased conservatively.
benefits:
  - "Improves posture and body awareness"

# At least 2–4 honest cautions; if truly none apply, say who the pose suits
# instead, but never ship an empty list.
contraindications:
  - "Knee injuries, keep a micro-bend"

steps:
  - "One instruction per step, imperative voice."
  - "Second step."

breathingPattern: "Inhale to rise, exhale to settle; 5–10 slow breaths."

# The doshas this pose traditionally helps balance (1–3 of):
associatedDoshas:
  - vata
  - kapha

# Optional: full YouTube URL of a genuinely free guide (any common form).
# Only add videos you have verified, and cite them again in sources.
# videoUrl: https://www.youtube.com/watch?v=…

# At least one source; classical citations name text + chapter/verse,
# modern books and videos are further guidance. Quote values containing
# colons, and quote verse numbers ("HYP 2.51") or YAML reads them oddly.
sources:
  - title: "Light on Yoga"
    author: "B. K. S. Iyengar"
    reference: "the pose's entry"
  # - title: "Haṭha Yoga Pradīpikā"
  #   author: "Svātmārāma"
  #   reference: "chapter 1, verses 46–49"
  # - title: "Pose name (video guide)"
  #   author: "Yoga With Adriene"
  #   url: https://www.youtube.com/watch?v=…
---


Optional "In the tradition" paragraph: the pose's classical context, its
name's meaning, or a note on where it sits in a practice. Markdown allowed.
