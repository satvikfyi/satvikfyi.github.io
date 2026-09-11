/**
 * Practice schema, the Zod validation for the `meditation-practices`
 * content collection. One collection holds both guided practices and the
 * philosophical concepts they rest on (`kind` separates them in the
 * listing). Server-side only (imports `z` from `astro:content`).
 */
import { z } from 'astro:content';
import { PRACTICE_KINDS } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const sourceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const practiceSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  sanskritName: z.string().trim().optional(),
  kind: z.enum(PRACTICE_KINDS),
  summary: z.string().trim().min(1),
  /** Which stream the practice comes from, e.g. "Pātañjala yoga". */
  tradition: z.string().trim().min(1),
  /** For practices, how to do it. For concepts, how to explore it in experience. */
  steps: z.array(z.string().trim().min(1)).min(1),
  /** Effects traditionally reported or reasonably expected. */
  effects: z.array(z.string().trim().min(1)).min(1),
  /** Honest cautions where they apply (trauma-sensitive notes, etc.). */
  precautions: z.array(z.string().trim().min(1)).default([]),
  /** How long / how often, empty for purely conceptual entries. */
  durationGuidance: z.string().trim().default(''),
  sources: z.array(sourceSchema).min(1),
});

export type Practice = z.infer<typeof practiceSchema>;
export type PracticeSource = z.infer<typeof sourceSchema>;
