/**
 * Mantra schema, the Zod validation for the `mantras` content collection,
 * following the master specification: deity, text, transliteration, meaning,
 * meter, usage, optional video. Server-side only (imports `z` from
 * `astro:content`).
 */
import { z } from 'astro:content';
import { MANTRA_CATEGORIES } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const sourceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const mantraSchema = z.object({
  /** Display name, e.g. "Gāyatrī Mantra". */
  name: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  /** Deity or principle the mantra addresses. */
  deity: z.string().trim().min(1),
  /** Stream the mantra comes from, e.g. "Vedic". */
  tradition: z.string().trim().min(1),
  category: z.enum(MANTRA_CATEGORIES),
  summary: z.string().trim().min(1),
  /** Full text in Devanāgarī. */
  text: z.string().trim().min(1),
  /** The same text in IAST transliteration. */
  transliteration: z.string().trim().min(1),
  meaning: z.string().trim().min(1),
  /** Metrical form, or "bīja (seed syllable)" / "free repetition". */
  meter: z.string().trim().min(1),
  /** When and how the mantra is traditionally used. */
  usage: z.string().trim().min(1),
  /** Full YouTube URL; rendered as a lazy nocookie embed. */
  videoUrl: z.string().url().optional(),
  sources: z.array(sourceSchema).min(1),
});

export type Mantra = z.infer<typeof mantraSchema>;
export type MantraSource = z.infer<typeof sourceSchema>;
