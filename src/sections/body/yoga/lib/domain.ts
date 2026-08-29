/**
 * Yoga module domain, pure, client-safe constants, types and label maps.
 *
 * Imported by BOTH server pages and the vanilla-TS islands, so it must never
 * import anything Astro-specific. The dosha vocabulary is deliberately a
 * local copy: modules may not import from each other, and the shared layer
 * must stay free of domain logic.
 */

export const DOSHAS = ['vata', 'pitta', 'kapha'] as const;
export type Dosha = (typeof DOSHAS)[number];

export const POSE_CATEGORIES = [
  'standing',
  'balance',
  'forward-bend',
  'backbend',
  'twist',
  'inversion',
  'seated',
  'meditative',
  'supine',
  'restful',
] as const;
export type PoseCategory = (typeof POSE_CATEGORIES)[number];

export const POSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type PoseLevel = (typeof POSE_LEVELS)[number];

export const doshaLabel: Record<Dosha, string> = {
  vata: 'vāta',
  pitta: 'pitta',
  kapha: 'kapha',
};

export const poseCategoryLabel: Record<PoseCategory, string> = {
  standing: 'Standing',
  balance: 'Balance',
  'forward-bend': 'Forward bend',
  backbend: 'Backbend',
  twist: 'Twist',
  inversion: 'Inversion',
  seated: 'Seated',
  meditative: 'Meditative',
  supine: 'Reclined',
  restful: 'Restful',
};

export const poseLevelLabel: Record<PoseLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function isDosha(value: unknown): value is Dosha {
  return typeof value === 'string' && (DOSHAS as readonly string[]).includes(value);
}

/**
 * Extract a YouTube video id from the common URL forms
 * (youtube.com/watch?v=…, youtu.be/…, youtube.com/embed/…). Returns null for
 * anything else; the shared YouTubeEmbed component takes the bare id.
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
