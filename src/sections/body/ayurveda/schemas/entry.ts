/**
 * Ayurveda entry schema, the Zod validation for the `ayurveda-entries`
 * content collection (registered in src/content.config.ts). Server-side
 * only: imports `z` from `astro:content`; islands use `import type` only.
 */
import { z } from 'astro:content';
import { DOSHA_EFFECTS, ENTRY_KINDS, PROPERTIES, TASTES } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const sourceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  /** Chapter / verse locator, e.g. "Sūtrasthāna 25.40". */
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const ayurvedaEntrySchema = z.object({
  /** Common English name, e.g. "Turmeric". */
  name: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  /** Sanskrit name in IAST transliteration, e.g. "Haridrā". */
  sanskritName: z.string().trim().optional(),
  kind: z.enum(ENTRY_KINDS),
  summary: z.string().trim().min(1),
  /** Plant part (root, leaf, seed…) or the ingredient itself for foods. */
  partUsed: z.string().trim().min(1),
  /** Tastes present (ṣaḍ rasa), at least one. */
  tastes: z.array(z.enum(TASTES)).min(1),
  doshaEffects: z.object({
    vata: z.enum(DOSHA_EFFECTS),
    pitta: z.enum(DOSHA_EFFECTS),
    kapha: z.enum(DOSHA_EFFECTS),
  }),
  /** Energetic properties (guṇa / vīrya) from the controlled vocabulary. */
  properties: z.array(z.enum(PROPERTIES)).min(1),
  /** Traditional uses, always educational, never prescriptive claims. */
  indications: z.array(z.string().trim().min(1)).min(1),
  /** Situations, conditions or combinations where caution or avoidance applies. */
  contraindications: z.array(z.string().trim().min(1)).default([]),
  /** How the herb or ingredient is traditionally prepared and taken. */
  preparation: z.string().trim().min(1),
  /** Path under /assets/images/ayurveda/, optional. */
  image: z.string().optional(),
  /**
   * Site-relative URL of this entry's new home in the wiki. Entries with
   * this field render a soft-redirect stub (meta-refresh + canonical to
   * the wiki URL, excluded from the search index) instead of their
   * content, and drop out of the listing. Fully reversible: remove the
   * field and the entry returns.
   */
  movedTo: z.string().trim().optional(),
  sources: z.array(sourceSchema).min(1),
});

export type AyurvedaEntry = z.infer<typeof ayurvedaEntrySchema>;
export type AyurvedaSource = z.infer<typeof sourceSchema>;
