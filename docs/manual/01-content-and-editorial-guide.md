# Module 1: Content & Volunteer Editorial Guide

For volunteers who draft content and the editors who review it. Nothing in
this module requires touching the repository; the hand-off happens through
the submission template in §3.

## 1. Satvik philosophy & style rules

### Core principles

Satvik living, as this site presents it, is the practical wing of the Indian
traditions: food that clears rather than dulls, breath that steadies, work
offered rather than traded. Five principles govern every page:

1. **Source-first.** Classical claims cite their text and locator
   (Bhagavad Gītā 2.47, Haṭha Yoga Pradīpikā chapter 2). Modern books and
   teachers are named as modern. Where tradition and scholarship disagree,
   say so instead of flattening it.
2. **Non-dogmatic.** The traditions disagree with each other, gloriously.
   Write "the Śaiva tradition holds…" not "the truth is…". Never claim
   superiority of one path, deity, or lineage over another.
3. **Respectful of tradition, useful to the reader.** Sanskrit terms appear
   in IAST transliteration (dhyāna, prāṇāyāma, Tāḍāsana) with a plain-English
   gloss on first use. Do not invent verse numbers; if unsure of a locator,
   name the text and chapter only.
4. **Practical and kind.** Speak to a busy householder, not a scholar.
   Give quantities, counts, durations. Never shame a reader's current diet
   or practice.
5. **Free and private.** No selling, no lead generation, no tracking links
   in copy. Affiliate links and sponsored content are forbidden everywhere.

### Tone of voice

- Warm, plain, unhurried; literate but never ornate. Imagine explaining to
  an intelligent friend over chai.
- Second person ("you") for instructions; first person plural ("we") for
  the site's own voice.
- Confidence with humility: state what the tradition says, mark what is
  interpretation, and never overpromise results.

### Terminology guidelines

| Rule | Right | Wrong |
| --- | --- | --- |
| One spelling for the brand word | satvik | sattvic, satvic, sattvik |
| Sanskrit in IAST with diacritics | prāṇāyāma, Bhagavad Gītā, Tāḍāsana | pranayama, Bhagavad Gita, Tadasana |
| IAST is for terms; Latin script for URLs and file names | `/mind/pranayama/` | `/mind/prāṇāyāma/` |
| En dashes for ranges (correct typography) | verses 2.51–53, 1–3 rounds, serves 2–4 | 2.51-53 |
| No em dashes anywhere in copy | use commas, colons, parentheses | "the breath — the mind's leash" |
| Keep the Sanskrit nouns as Sanskrit | sattva (the guṇa), sāttvika (the adjective, IAST) | inventing English hybrids |
| Spell deities and texts consistently | Śiva, Viṣṇu, Gaṇeśa, Devī, Upaniṣads | Shiva, Vishnu, Ganesha, Upanishads |

The satvik spelling rule and the em-dash ban are enforced by review, not by
the build; everything else in the table is convention. When in doubt, match
the existing collection.

### Forbidden themes

Do not submit, and editors must reject:

- Medical claims: curing diseases, replacing medication, dosages of herbs
  for conditions, before/after health promises.
- Miraculous or fear-based framing: "this mantra will change your life in
  21 days", curses, astrology-based predictions.
- Sectarian or denigrating content about any tradition, deity, guru, or
  religion, including comparisons that declare winners.
- Political commentary, current events, or living-person controversy.
- Personal data: no names, photos, or health details of real people
  (including yourself) beyond "a family notebook".
- Gatekept material: rituals or initiations the tradition transmits only
  person-to-person (tantra pages describe, never instruct; lineages are
  named as the venue).
- SEO bait: keyword stuffing, misleading titles, AI-spun rewrites of other
  sites' articles.

## 2. Health & legal disclaimers

The site renders disclaimers automatically on every relevant page. Volunteers
do not need to add them to drafts, but must not write copy that contradicts
them. The canonical texts (from the shared `Disclaimer` component):

**Ayurveda (recipes, herbs, ingredients):**
> Ayurvedic knowledge on this site is shared for educational purposes and
> reflects traditional sources, which are cited where used. It is not
> medical advice. Ayurvedic herbs and preparations can interact with medical
> conditions, medications and pregnancy. Consult a qualified practitioner or
> physician before changing your diet, herbs or treatment.

**Yoga (poses):**
> Asana instructions on this site are educational and drawn from cited
> traditional or modern sources. They are not medical advice. Practice
> within your limits, adapt with props or a teacher's guidance, and consult
> a physician if you are pregnant or managing an injury or health condition.

**Pranayama (breathing techniques):**
> Pranayama is a powerful practice traditionally learned under a teacher's
> supervision. If you are pregnant, or live with a cardiac, respiratory or
> mental-health condition, consult a qualified teacher and a physician
> before practicing. Never strain the breath; stop if you feel dizzy or
> unwell.

**General (blog, wiki, soul paths):**
> Satvik.fyi shares traditional wisdom for educational purposes,
> distinguishing scripture and classical sources from modern interpretation.
> Nothing on this site is professional medical, psychological or spiritual
> advice.

Drafting rule of thumb: every how-to piece carries its field's caution list
(pranayama entries require at least one contraindication or the build
fails), and no sentence may promise a health outcome.

## 3. Draft submission template (volunteers)

Volunteers submit one document per entry, in Google Docs or Word, following
this layout exactly. Copy this block into the doc as a starting structure:

```text
TITLE:        (display name, e.g. "Warrior II" or "Why We Cook Before Dawn")
SLUG:         (leave blank; the editor assigns a kebab-case file name)
TYPE:         recipe | yoga pose | ayurveda herb/ingredient | pranayama |
              meditation practice | mantra | soul teaching | blog post | wiki article
SUMMARY:      (1–2 sentences; appears on cards and in search)
INTRO:        (2–3 short paragraphs of context or story)
BODY:         (for recipes: ingredients with quantities, then numbered steps;
               for practices: numbered how-to steps; for essays: sections
               with subheadings)
TAGS/EFFECTS: (doshas it helps, meal type, level, category; approximate is
               fine, the editor refines)
CAUTIONS:     (who should avoid or adapt; "none known" is not acceptable
              without a justification sentence)
SOURCES:      (at least one: book + author, or text + chapter/verse, or
              "family recipe notebook")
ASSETS:       (optional: attach images per §4; note the photographer/ license)
AUTHOR:       (name as it should appear, or "Anonymous")
```

**Review checklist for editors** (in order):

1. Type and structure match; nothing missing.
2. Tone and terminology pass (§1); forbidden themes scan.
3. Cautions present and honest; no medical claims.
4. Sources plausible and locators sane; verse numbers checked or removed.
5. Transpose into the collection template (Module 2, §3) and let the build
   gates do the rest.

## 4. Asset specifications

Images are optional per entry; when supplied they must meet these rules so
the site keeps its CI performance bar (Lighthouse performance ≥ 0.90).

| Use | Dimensions | Format | Target size |
| --- | --- | --- | --- |
| Recipe/pose/entry card image | 1200 × 600 (2:1) | WebP | ≤ 60 KB |
| Blog cover / hero | 1600 × 800 (2:1) | WebP | ≤ 120 KB |
| Detail-page inline photo | ≤ 1200 wide | WebP | ≤ 100 KB |
| Social share (og:image) | 1200 × 630 | PNG (fixed design) | provided by site |

Rules:

- **WebP for all content photos.** Convert with
  `cwebp -q 80 input.jpg -o output.webp` (or Squoosh.app, quality 80).
  Photographs only; screenshots and diagrams may stay PNG if crisp text
  matters, same size budget.
- **File naming:** kebab-case, ASCII, no spaces (`ghee-rice-hero.webp`).
- **Placement:** the editor drops files into
  `public/assets/images/{module}/` and references just the file name in
  frontmatter (`coverImage: ghee-rice-hero.webp`); blog covers additionally
  become the social-share image automatically.
- **Alt text:** describe what the image shows for a reader who cannot see
  it ("a bowl of kitchari topped with coriander"). Purely decorative images
  use empty alt (`alt=""`) and stay rare. Never stuff keywords.
- **Consent and license:** only submit photos you took or have written
  permission to publish; note the photographer for the credits line. No
  identifiable people without their consent.
- **Never** embed screenshots of the site itself; and no hotlinking:
  assets live in the repository, not on third-party CDNs.
