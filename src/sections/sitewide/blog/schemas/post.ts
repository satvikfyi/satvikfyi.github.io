/**
 * Post schema, the Zod validation for the `blog-posts` collection,
 * following the master specification's Blog post shape (title, date, tags,
 * excerpt, coverImage?, author) plus slug, opt-in comments and drafts.
 * Authoring a post = adding one markdown file; nothing else changes.
 */
import { z } from 'astro:content';
import { tagKebab } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export const postSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  /** Publication date, YYYY-MM-DD. */
  date: z.string().regex(isoDate, 'YYYY-MM-DD'),
  /** Optional revision date, YYYY-MM-DD; shown as "Updated". */
  updated: z.string().regex(isoDate, 'YYYY-MM-DD').optional(),
  excerpt: z.string().trim().min(1),
  tags: z.array(z.string().regex(tagKebab, 'kebab-case tags')).min(1),
  author: z.string().trim().min(1),
  /** Path under /assets/images/blog/, optional; also used as og:image. */
  coverImage: z.string().optional(),
  /**
   * Giscus comments are opt-in per post: set `comments: true` after the
   * Giscus app is configured in src/config/site.ts.
   */
  comments: z.boolean().default(false),
  /** Draft posts are excluded from the listing, tag pages and RSS. */
  draft: z.boolean().default(false),
});

export type Post = z.infer<typeof postSchema>;
