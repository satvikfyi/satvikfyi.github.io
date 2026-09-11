/**
 * Wiki article schema, the Zod validation for the `wiki-articles`
 * collection, following the master specification (title, category, summary,
 * references[], related[]). Cross-references are plain slugs of other wiki
 * articles; the detail page renders them as links and computes the reverse
 * direction (backlinks) at build time.
 */
import { z } from 'astro:content';
import { WIKI_CATEGORIES, DOSHA_EFFECTS, PROPERTIES, TASTES } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const referenceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

/**
 * Optional āyurvedic profile for ingredient entries (the "ghee rule":
 * one entry, kitchen and ayurveda sections inside). Fields and enums
 * mirror the ayurveda module's entry schema so its entries convert
 * mechanically; strict enums mean the conversion cannot introduce
 * typo drift — the build fails on any violation.
 */
export const dravyaSchema = z.object({
  sanskritName: z.string().trim().optional(),
  partUsed: z.string().trim().min(1),
  tastes: z.array(z.enum(TASTES)).min(1),
  doshaEffects: z.object({
    vata: z.enum(DOSHA_EFFECTS),
    pitta: z.enum(DOSHA_EFFECTS),
    kapha: z.enum(DOSHA_EFFECTS),
  }),
  properties: z.array(z.enum(PROPERTIES)).min(1),
  indications: z.array(z.string().trim().min(1)).min(1),
  contraindications: z.array(z.string().trim().min(1)).default([]),
  preparation: z.string().trim().min(1),
});

export const wikiArticleSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  category: z.enum(WIKI_CATEGORIES),
  summary: z.string().trim().min(1),
  /**
   * Canonical ingredient name this entry serves (the join key for
   * recipe ↔ wiki linking). Must equal a name from
   * content/recipes/ingredients.json exactly; required in practice for
   * ingredient entries, absent otherwise.
   */
  ingredientItem: z.string().trim().optional(),
  /** Slugs of related wiki articles (any category). Rendered as links; the reverse direction is computed at build. */
  related: z.array(z.string().regex(kebab)).default([]),
  /** Āyurvedic profile section, rendered as a table when present. */
  dravya: dravyaSchema.optional(),
  references: z.array(referenceSchema).min(1),
});

export type WikiArticle = z.infer<typeof wikiArticleSchema>;
export type WikiReference = z.infer<typeof referenceSchema>;
