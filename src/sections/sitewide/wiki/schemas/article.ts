/**
 * Wiki article schema, the Zod validation for the `wiki-articles`
 * collection, following the master specification (title, category, summary,
 * references[], related[]). Cross-references are plain slugs of other wiki
 * articles; the detail page renders them as links and computes the reverse
 * direction (backlinks) at build time.
 */
import { z } from 'astro:content';
import { WIKI_CATEGORIES } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const referenceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const wikiArticleSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  category: z.enum(WIKI_CATEGORIES),
  summary: z.string().trim().min(1),
  /** Slugs of related wiki articles (any category). Rendered as links; the reverse direction is computed at build. */
  related: z.array(z.string().regex(kebab)).default([]),
  references: z.array(referenceSchema).min(1),
});

export type WikiArticle = z.infer<typeof wikiArticleSchema>;
export type WikiReference = z.infer<typeof referenceSchema>;
