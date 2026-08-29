/**
 * Pranayama module domain, pure, client-safe constants, types and label
 * maps. Imported by BOTH server pages and the vanilla-TS islands, so it must
 * never import anything Astro-specific. Dosha vocabulary is a local copy by
 * design (no module→module imports; shared stays free of domain logic).
 */

export const DOSHAS = ['vata', 'pitta', 'kapha'] as const;
export type Dosha = (typeof DOSHAS)[number];

export const PRANAYAMA_CATEGORIES = [
  'calming',
  'balancing',
  'energizing',
  'cooling',
  'cleansing',
] as const;
export type PranayamaCategory = (typeof PRANAYAMA_CATEGORIES)[number];

export const PRANAYAMA_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type PranayamaLevel = (typeof PRANAYAMA_LEVELS)[number];

export const doshaLabel: Record<Dosha, string> = {
  vata: 'vāta',
  pitta: 'pitta',
  kapha: 'kapha',
};

export const categoryLabel: Record<PranayamaCategory, string> = {
  calming: 'Calming',
  balancing: 'Balancing',
  energizing: 'Energizing',
  cooling: 'Cooling',
  cleansing: 'Cleansing',
};

export const levelLabel: Record<PranayamaLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function isDosha(value: unknown): value is Dosha {
  return typeof value === 'string' && (DOSHAS as readonly string[]).includes(value);
}

/**
 * Extract a YouTube video id from the common URL forms. Local copy, modules
 * may not import each other's helpers.
 */
export function youtubeId(url: string): string | null {
  const patterns = [
    /(?:^|\.)(?:youtube\.com)\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{6,})/i,
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /(?:^|\.)(?:youtube\.com|youtube-nocookie\.com)\/embed\/([A-Za-z0-9_-]{6,})/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
