/**
 * Wiki module domain, categories with labels and descriptions for the
 * index and category pages, plus the dravya vocabularies (copied from
 * the ayurveda module's domain and kept in sync — module
 * independence beats a shared import here; both lists are closed
 * enums, drift fails the build loudly). Pure and client-safe.
 */

export const WIKI_CATEGORIES = [
  'scriptures',
  'books',
  'gods',
  'worship',
  'concepts',
  'ingredients',
  'cooking-techniques',
] as const;
export type WikiCategory = (typeof WIKI_CATEGORIES)[number];

export const categoryLabel: Record<WikiCategory, string> = {
  scriptures: 'Scriptures',
  books: 'Books',
  gods: 'Deities',
  worship: 'Worship',
  concepts: 'Concepts',
  ingredients: 'Ingredients',
  'cooking-techniques': 'Cooking techniques',
};

export const categoryIntro: Record<WikiCategory, string> = {
  scriptures: 'The root texts, what they are, where they sit, and how they relate.',
  books: 'Modern works worth knowing, honestly described.',
  gods: 'The deities of the pan-Indian tradition, introduced without doctrine.',
  worship: 'The how of devotion, pūjā, āratī, prasāda and the household rites.',
  concepts: 'The vocabulary the traditions think in, dharma, karma, mokṣa and friends.',
  ingredients: 'The satvik pantry, one entry per canonical form: alt-names, kitchen use, and the ayurvedic view where it applies.',
  'cooking-techniques': 'The methods behind the recipes: tempering, roasting, steaming, fermenting, and the syrup stages.',
};

export function categoryHref(category: WikiCategory): string {
  return `/wiki/${category}/`;
}

export function articleHref(category: WikiCategory, slug: string): string {
  return `/wiki/${category}/${slug}/`;
}

/** ṣaḍ rasa; kept in sync with body/ayurveda/lib/domain.ts. */
export const TASTES = ['sweet', 'sour', 'salty', 'pungent', 'bitter', 'astringent'] as const;
export type Taste = (typeof TASTES)[number];

/** Dosha effect vocabulary; kept in sync with body/ayurveda/lib/domain.ts. */
export const DOSHA_EFFECTS = ['balancing', 'neutral', 'aggravating'] as const;
export type DoshaEffect = (typeof DOSHA_EFFECTS)[number];

/** Property vocabulary (guṇa / vīrya); kept in sync with body/ayurveda/lib/domain.ts. */
export const PROPERTIES = [
  'heating',
  'cooling',
  'light',
  'heavy',
  'oily',
  'dry',
  'sharp',
  'mild',
  'mobile',
  'grounding',
] as const;
export type Property = (typeof PROPERTIES)[number];
