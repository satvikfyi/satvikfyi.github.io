/**
 * Pose schema, the Zod validation for the `yoga-poses` content collection
 * (registered in src/content.config.ts). Server-side only: it imports `z`
 * from `astro:content`, so islands must not import the schema itself; they
 * import types via `import type` (erased at build).
 */
import { z } from 'astro:content';
import { DOSHAS, POSE_CATEGORIES, POSE_LEVELS } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const sourceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  /** Chapter / verse or pose-number locator, e.g. "HYP 1.19". */
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const poseSchema = z.object({
  /** English / common name, e.g. "Mountain Pose". */
  name: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  /** Sanskrit name in IAST transliteration, e.g. "Tāḍāsana". */
  sanskritName: z.string().trim().min(1),
  category: z.enum(POSE_CATEGORIES),
  level: z.enum(POSE_LEVELS),
  summary: z.string().trim().min(1),
  benefits: z.array(z.string().trim().min(1)).min(1),
  contraindications: z.array(z.string().trim().min(1)).min(1),
  steps: z.array(z.string().trim().min(1)).min(1),
  /** How the breath pairs with the pose (in / out / hold guidance). */
  breathingPattern: z.string().trim().min(1),
  /** Doshas this pose traditionally helps balance (1–3). */
  associatedDoshas: z.array(z.enum(DOSHAS)).min(1),
  /** Path under /assets/images/yoga/, optional. */
  image: z.string().optional(),
  /** Full YouTube URL (any common form); rendered as a lazy nocookie embed. */
  videoUrl: z.string().url().optional(),
  sources: z.array(sourceSchema).min(1),
});

export type Pose = z.infer<typeof poseSchema>;
export type PoseSource = z.infer<typeof sourceSchema>;
