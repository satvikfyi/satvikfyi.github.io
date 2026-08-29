/**
 * Meals module domain, pure, client-safe constants, types and label maps.
 *
 * This file is imported by BOTH server pages and the vanilla-TS islands, so
 * it must never import anything Astro-specific (no `astro:content` here, 
 * that lives in `../schemas/recipe.ts`, server-side only).
 */

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const DOSHAS = ['vata', 'pitta', 'kapha'] as const;
export type Dosha = (typeof DOSHAS)[number];

export const DOSHA_EFFECTS = ['balancing', 'neutral', 'aggravating'] as const;
export type DoshaEffect = (typeof DOSHA_EFFECTS)[number];

export const SEASONS = ['spring', 'summer', 'monsoon', 'autumn', 'winter', 'all-year'] as const;
export type Season = (typeof SEASONS)[number];

/**
 * Controlled satvik tag vocabulary. Recipes validate against this list, so
 * the tag filter can render its options statically.
 */
export const SATVIK_TAGS = [
  'satvik',
  'tridoshic',
  'light',
  'warming',
  'cooling',
  'fresh-cooked',
  'dairy',
  'gluten-free',
  'protein-rich',
  'no-onion-garlic',
] as const;
export type SatvikTag = (typeof SATVIK_TAGS)[number];

export type DoshaEffects = Record<Dosha, DoshaEffect>;

export const mealTypeLabel: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

/** IAST transliteration for the chips; plain key for URLs/data attributes. */
export const doshaLabel: Record<Dosha, string> = {
  vata: 'vāta',
  pitta: 'pitta',
  kapha: 'kapha',
};

export const seasonLabel: Record<Season, string> = {
  spring: 'Spring (vasanta)',
  summer: 'Summer (grīṣma)',
  monsoon: 'Monsoon (varṣā)',
  autumn: 'Autumn (śarada)',
  winter: 'Winter (hemanta)',
  'all-year': 'All year',
};

export const satvikTagLabel: Record<SatvikTag, string> = {
  satvik: 'Satvik',
  tridoshic: 'Tridoshic',
  light: 'Light',
  warming: 'Warming',
  cooling: 'Cooling',
  'fresh-cooked': 'Freshly cooked',
  dairy: 'Contains dairy',
  'gluten-free': 'Gluten-free',
  'protein-rich': 'Protein-rich',
  'no-onion-garlic': 'No onion or garlic',
};

export const effectSymbol: Record<DoshaEffect, string> = {
  balancing: '+',
  neutral: '·',
  aggravating: '−',
};

export const effectPhrase: Record<DoshaEffect, (dosha: string) => string> = {
  balancing: (d) => `Balances ${d}`,
  neutral: (d) => `Neutral for ${d}`,
  aggravating: (d) => `Can aggravate ${d}`,
};

/** Seasons a user can filter by (“all-year” is implicit in every match). */
export const FILTER_SEASONS = SEASONS.filter((s): s is Exclude<Season, 'all-year'> => s !== 'all-year');

export function isDosha(value: unknown): value is Dosha {
  return typeof value === 'string' && (DOSHAS as readonly string[]).includes(value);
}
