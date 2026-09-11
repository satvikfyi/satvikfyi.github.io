/**
 * Mantras module domain, pure constants and label maps. Zero client JS in
 * this module (the listing groups statically), but the pattern holds.
 */

export const MANTRA_CATEGORIES = [
  'foundation',
  'peace',
  'wisdom',
  'prosperity',
  'protection',
  'devotion',
] as const;
export type MantraCategory = (typeof MANTRA_CATEGORIES)[number];

export const categoryLabel: Record<MantraCategory, string> = {
  foundation: 'Foundations',
  peace: 'Peace & śānti',
  wisdom: 'Wisdom & learning',
  prosperity: 'Prosperity',
  protection: 'Protection & healing',
  devotion: 'Devotion',
};

export const categoryIntro: Record<MantraCategory, string> = {
  foundation: 'The syllables everything else stands on.',
  peace: 'Invocations of peace, for sittings, for endings, for the world.',
  wisdom: 'For study, speech and the clearing of understanding.',
  prosperity: 'For abundance understood the satvik way, enough, flowing.',
  protection: 'For healing, courage and the warding of fear.',
  devotion: 'Names of the beloved, repeated for love’s own sake.',
};

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
