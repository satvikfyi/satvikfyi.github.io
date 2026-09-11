/**
 * Teaching schema, the Zod validation for the shared `soul-teachings`
 * collection: a scriptural passage (transliterated in IAST where Sanskrit)
 * with its translation, a reflective essay (the entry's markdown body) and
 * sources. Keyed by `path` so each soul module's overview page renders its
 * own teachings.
 */
import { z } from 'astro:content';
import { SOUL_PATHS } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const sourceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const teachingSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  path: z.enum(SOUL_PATHS),
  summary: z.string().trim().min(1),
  /** Scripture or text the passage comes from, e.g. "Bhagavad Gītā". */
  scripture: z.string().trim().min(1),
  /** Locator, e.g. "2.47" or "chapter 1, verse 2". */
  reference: z.string().trim().min(1),
  /** The passage itself in IAST transliteration (omitted for prose teachings). */
  sanskrit: z.string().trim().optional(),
  translation: z.string().trim().min(1),
  sources: z.array(sourceSchema).min(1),
});

export type Teaching = z.infer<typeof teachingSchema>;
export type TeachingSource = z.infer<typeof sourceSchema>;
