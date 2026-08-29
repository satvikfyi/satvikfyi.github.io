# Ayurvedic Classification Methodology

How this site classifies a food, or a *combination* of foods; along the
tridosha scale of **kapha**, **pitta** and **vāta** (also called vāyu).
This is the rubric behind every `doshaEffects` tag in the meals module,
and the checklist for reviewing or adding those tags.

> Scope note: this is a practical household rubric for tagging a recipe
> collection, not a clinical manual. It compresses a vast tradition into
> workable rules; the classical sources and a qualified practitioner sit
> behind anything serious. Educational, never medical advice.

## 1. The four lenses (per ingredient)

Classical ayurveda describes a food's action through four properties.
For tagging, evaluate each ingredient through all four and let the
strongest signals win:

| Lens | Sanskrit | Question | Example |
| ---- | -------- | -------- | ------- |
| Taste | rasa | Which of the six tastes dominates? (sweet, sour, salty, pungent, bitter, astringent) | jaggery = sweet |
| Potency | vīrya | Heating or cooling in the body? | ginger = heating; coconut = cooling |
| Post-digestive effect | vipāka | How does it land after digestion (sweet/sour/pungent)? | urad dal = sweet vipāka → building |
| Quality | guṇa | Heavy/light, unctuous/dry, hot/cold, slow/sharp, etc. | mung = light; wheat = heavy |

### Taste → dosha quick table

| Taste | Pacifies | Aggravates |
| ----- | -------- | ---------- |
| Sweet | vāta, pitta | kapha |
| Sour | vāta | pitta, kapha |
| Salty | vāta | pitta, kapha |
| Pungent | kapha | vāta, pitta |
| Bitter | pitta, kapha | vāta |
| Astringent | pitta, kapha | vāta |

(Vāta is aggravated by everything dry, light and cold; pitta by
everything hot, sharp and sour; kapha by everything heavy, sweet, cold
and unctuous.)

## 2. Base table for staples (working reference)

Aggregated from the classical nighaṇṭus and modern ayurvedic cookery, 
amend freely during review; the family's judgement wins.

| Ingredient | Vāta | Pitta | Kapha | Note |
| ---------- | ---- | ----- | ----- | ---- |
| mung dal (split) | balancing | neutral | balancing | the classic "lightest dal" |
| urad dal | balancing | neutral | aggravating | heavy, building |
| toor dal | neutral | neutral | neutral | depends on tempering |
| basmati/śāli rice | neutral | balancing | aggravating | cooling, light for a grain |
| wheat (atta) | balancing | neutral | aggravating | grounding, building |
| oats | balancing | neutral | aggravating | moist when well-cooked |
| potato | neutral | neutral | aggravating | heavy; spices offset |
| lauki/ash gourd | neutral | balancing | neutral | cooling gourds |
| spinach | neutral | neutral | balancing | lightens |
| tomato | neutral | aggravating | neutral | sour + heating |
| lemon | neutral | neutral | balancing | clarifying in small amounts |
| ginger (fresh) | balancing | neutral | balancing | kindles all digestion; pitta in excess |
| turmeric | balancing | neutral | balancing | the great harmoniser |
| cumin | balancing | neutral | balancing | |
| black pepper | neutral | aggravating | balancing | |
| hing (asafoetida) | balancing | neutral | balancing | the satvik stand-in for onion/garlic |
| ghee | balancing | balancing | neutral | transports, harmonises |
| sesame/peanut oil | balancing | neutral | aggravating | warming |
| coconut (fresh) | neutral | balancing | aggravating | cooling, unctuous |
| yogurt (fresh) | neutral | aggravating | aggravating | channel-clogging when unspiced; takra is the exception |
| milk (warm, spiced) | balancing | neutral | aggravating | |
| jaggery | balancing | neutral | aggravating | sweet but kinder than sugar |
| onion | neutral | aggravating | neutral | rajas; excluded from satvik recipes here |
| garlic | neutral | aggravating | balancing | tamas/rajas; excluded from satvik recipes here |

## 3. Cooking method modifies everything

The same ingredient tags differently by method, evaluate the *dish*,
not the parts list:

- **Deep-frying** → adds heaviness/unctuousness: +kapha, −vata (grounding).
- **Steaming** (idli, dhokla) → lightest method: kapha-friendliest.
- **Slow simmering with water** (soups, dals) → vata-pacifying moisture.
- **Dry roasting** (upma, rava) → lighter but drying: +vata unless ghee offsets.
- **Raw** (salads, sprouts) → +vata, −kapha; best at midday in warm seasons.
- **Fermentation** → pre-digests: lighter than the raw batter (idli).
- **Whole spices in ghee (tadka)** → carries the spices deep; kindles agni.
- **Chilling** (ice cream) → +kapha, dampens agni; small summer portions.
- **Reheating/yesterday's food** → heavier; the tradition prefers fresh.

## 4. Scoring a recipe → the three tags

For each dosha, count factors that **pacify** vs **aggravate** it
(ingredients from the base table + method modifiers), then:

- clearly more pacifying than aggravating → `balancing`
- clearly more aggravating → `aggravating`
- mixed or mild → `neutral`

Rules of thumb:

- A dish can never balance all three doshas *and* be heavy, 
  kitchari-style lightness is what earns `tridoshic`.
- When one dosha's call is a coin-flip, mark `neutral` and let the
  `dietNotes` carry the nuance ("fine for pitta in small amounts").
- Portion context lives in `dietNotes`, not the tags: fried food is
  kapha-aggravating *as a habit*, not as one vada.

## 5. Classifying combinations (food combining)

The classical term is **viruddha āhāra**, incompatible combinations
(Charaka, Sūtrasthāna 26). For the planner and for meal composition,
check a *combination* against these cautions (the common, practical ones):

| Combination | Concern | Household practice |
| ----------- | ------- | ------------------ |
| Milk + sour fruit | curdles digestion | fruit raita/pachadi uses *fresh* curd, not milk; keep them distinct |
| Milk + salty/savoury | same channel conflict | badam milk stands alone, an hour from meals |
| Yogurt at night | kapha + cold channel blocking | takra/buttermilk at midday instead |
| Heating honey | considered harmful | honey goes into warm, not hot, things |
| Ghee + honey in equal weight | classical incompatibility | avoid in the same recipe |
| Fresh curd unspiced | kapha-clogging | always spiced (roasted cumin, ginger) |

**Planner hook (future):** when a day's plan pairs flagged items (e.g.
mango ice cream after ghee rice), the planner could surface a gentle
pairing note. The data model already supports it, combinations are
evaluable from the plan's recipe list, but the UI deliberately does not
moralise; a note, never a block.

## 6. Where tags live and how to change them

- Per recipe: `doshaEffects` in `content/recipes/{slug}.md`.
- The rubric above is the tiebreaker for review disagreements
  (docs/recipe-review.md, batch 10 cross-cutting pass).
- Any ingredient worth adding to the base table gets a row, the table is
  the shared vocabulary; the recipes are its application.

## Sources

- Charaka Saṃhitā, Sūtrasthāna 25–27 (dietetics, viruddha āhāra, takra)
- Aṣṭāṅga Hṛdaya, Sūtrasthāna 5–6 (rasas, food articles)
- Bhāvaprakāśa Nighaṇṭu (materia medica of foods)
- Vasant Lad & Usha Lad, *Ayurvedic Cooking for Self-Healing*
- David Frawley, *Ayurvedic Healing Cuisine*
