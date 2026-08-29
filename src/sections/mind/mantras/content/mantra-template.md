---
# Mantra template, copy into content/mantras/{slug}.md and rename the copy
# to match the slug. Lives outside mantras/ on purpose. Must satisfy
# schemas/mantra.ts; the build fails otherwise.
#
# Both scripts are required and always carried: text in Devanāgarī,
# transliteration in IAST. Quote any value containing a colon; multi-line
# texts stay on one line or use double-quoted folded style.

name: "Gāyatrī Mantra"              # display name
slug: gayatri-mantra                # kebab-case; MUST equal the file name
deity: "Savitṛ, the sun as illumination"   # deity or principle addressed
tradition: "Vedic"                  # e.g. Vedic, Śaiva, Gauḍīya Vaiṣṇava, Buddhist
category: wisdom                    # foundation | peace | wisdom | prosperity | protection | devotion
summary: "One or two sentences for the card and search description."

text: ॐ भूर्भुवः स्वः                    # full text, Devanāgarī
transliteration: "oṁ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṁ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt"

# Translate honestly; where a reading is interpretive, say so.
meaning: "We meditate on the excellent glory of the divine Savitṛ; may he illumine our intellects."

# Metrical form, or "bīja (seed syllable)" / "sixteen names" / "free closing invocation".
meter: "Gāyatrī: 24 syllables × 3 pādas"

# When and how traditionally used; flag mantras received from a teacher.
usage: "Recited at sunrise, noon and sunset; classically received from a teacher."

# Optional free rendition; verify before adding, cite again in sources.
# videoUrl: https://www.youtube.com/watch?v=…

sources:
  - title: "Ṛgveda"
    author: "Viśvāmitra's family book"
    reference: "3.62.10"
  # - title: "Rendition (video)"
  #   author: "Deva Premal & Miten"
  #   url: https://www.youtube.com/watch?v=…
---


Optional "In the tradition" paragraph: the mantra's story, its meters'
meaning, or a note on receiving it. Markdown allowed.
