/**
 * Wiki module domain, the five fixed categories from the master
 * specification's sitemap, with labels and descriptions for the index and
 * category pages. Pure and client-safe.
 */

export const WIKI_CATEGORIES = ['scriptures', 'books', 'gods', 'worship', 'concepts'] as const;
export type WikiCategory = (typeof WIKI_CATEGORIES)[number];

export const categoryLabel: Record<WikiCategory, string> = {
  scriptures: 'Scriptures',
  books: 'Books',
  gods: 'Deities',
  worship: 'Worship',
  concepts: 'Concepts',
};

export const categoryIntro: Record<WikiCategory, string> = {
  scriptures: 'The root texts, what they are, where they sit, and how they relate.',
  books: 'Modern works worth knowing, honestly described.',
  gods: 'The deities of the pan-Indian tradition, introduced without doctrine.',
  worship: 'The how of devotion, pūjā, āratī, prasāda and the household rites.',
  concepts: 'The vocabulary the traditions think in, dharma, karma, mokṣa and friends.',
};

export function categoryHref(category: WikiCategory): string {
  return `/wiki/${category}/`;
}

export function articleHref(category: WikiCategory, slug: string): string {
  return `/wiki/${category}/${slug}/`;
}
