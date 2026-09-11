/**
 * Ayurveda module domain, pure, client-safe constants, types and label maps.
 *
 * Imported by BOTH server pages and the vanilla-TS islands, so it must never
 * import anything Astro-specific. Dosha vocabulary is a local copy by design
 * (no module→module imports; shared stays free of domain logic).
 */

export const DOSHAS = ['vata', 'pitta', 'kapha'] as const;
export type Dosha = (typeof DOSHAS)[number];

export const DOSHA_EFFECTS = ['balancing', 'neutral', 'aggravating'] as const;
export type DoshaEffect = (typeof DOSHA_EFFECTS)[number];

export const ENTRY_KINDS = ['herb', 'ingredient'] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

/** The six tastes (ṣaḍ rasa) of ayurvedic pharmacology and cookery. */
export const TASTES = ['sweet', 'sour', 'salty', 'pungent', 'bitter', 'astringent'] as const;
export type Taste = (typeof TASTES)[number];

/**
 * Controlled property vocabulary (guṇa / vīrya descriptors). Kebab keys for
 * data attributes; labels carry the Sanskrit term in IAST.
 */
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

export type DoshaEffects = Record<Dosha, DoshaEffect>;

export const doshaLabel: Record<Dosha, string> = {
  vata: 'vāta',
  pitta: 'pitta',
  kapha: 'kapha',
};

export const entryKindLabel: Record<EntryKind, string> = {
  herb: 'Herb',
  ingredient: 'Kitchen ingredient',
};

export const tasteLabel: Record<Taste, string> = {
  sweet: 'Sweet (madhura)',
  sour: 'Sour (amla)',
  salty: 'Salty (lavaṇa)',
  pungent: 'Pungent (kaṭu)',
  bitter: 'Bitter (tikta)',
  astringent: 'Astringent (kaṣāya)',
};

export const propertyLabel: Record<Property, string> = {
  heating: 'Heating (uṣṇa vīrya)',
  cooling: 'Cooling (śīta vīrya)',
  light: 'Light (laghu)',
  heavy: 'Heavy (guru)',
  oily: 'Oily (snigdha)',
  dry: 'Dry (rūkṣa)',
  sharp: 'Sharp (tīkṣṇa)',
  mild: 'Mild (mṛdu)',
  mobile: 'Mobile (cala)',
  grounding: 'Grounding (sthira)',
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

export function isDosha(value: unknown): value is Dosha {
  return typeof value === 'string' && (DOSHAS as readonly string[]).includes(value);
}
