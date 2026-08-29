/**
 * Technique schema, the Zod validation for the `pranayama-techniques`
 * content collection. Server-side only (imports `z` from `astro:content`).
 *
 * Safety is structural here: `contraindications` requires at least one
 * honest entry for EVERY technique, and `requiresTeacher` flags the
 * practices that the tradition says must be learned under supervision.
 */
import { z } from 'astro:content';
import { DOSHAS, PRANAYAMA_CATEGORIES, PRANAYAMA_LEVELS } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const sourceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  /** Chapter / verse locator, e.g. "HYP 2.51–53". */
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const techniqueSchema = z.object({
  /** English / descriptive name, e.g. "Alternate Nostril Breathing". */
  name: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  /** Sanskrit name in IAST transliteration, e.g. "Nāḍī Śodhana". */
  sanskritName: z.string().trim().min(1),
  category: z.enum(PRANAYAMA_CATEGORIES),
  level: z.enum(PRANAYAMA_LEVELS),
  summary: z.string().trim().min(1),
  benefits: z.array(z.string().trim().min(1)).min(1),
  /** MANDATORY safety field, at least one honest caution per technique. */
  contraindications: z
    .array(z.string().trim().min(1))
    .min(1, 'every pranayama technique must list contraindications'),
  steps: z.array(z.string().trim().min(1)).min(1),
  /** Counting pattern, e.g. "1:4:2, inhale 1, retain 4, exhale 2". */
  rhythm: z.string().trim().min(1),
  /** How long and how often to practise. */
  durationGuidance: z.string().trim().min(1),
  associatedDoshas: z.array(z.enum(DOSHAS)).min(1),
  /** True for practices the tradition insists are learned under a teacher. */
  requiresTeacher: z.boolean().default(false),
  videoUrl: z.string().url().optional(),
  sources: z.array(sourceSchema).min(1),
});

export type Technique = z.infer<typeof techniqueSchema>;
export type TechniqueSource = z.infer<typeof sourceSchema>;
