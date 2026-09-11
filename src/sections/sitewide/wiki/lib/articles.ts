/**
 * Collection helpers for the wiki module, shared by the index, category
 * pages and article pages, so the alphabetical order, the slug→article map
 * (for related links) and the backlink computation can never disagree.
 * Server-side only (imports astro:content).
 */
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { isModuleEnabled } from '../../../../config/sections';

export type WikiEntry = CollectionEntry<'wiki-articles'>;

/** All articles as raw entries (renderable), alphabetically by title. */
export async function allArticles(): Promise<WikiEntry[]> {
  const entries = await getCollection('wiki-articles');
  return entries.sort((a, b) => a.data.title.localeCompare(b.data.title, 'en'));
}

/** slug → entry map; the single resolver for related references. */
export async function articleMap(): Promise<Map<string, WikiEntry>> {
  return new Map((await allArticles()).map((entry) => [entry.data.slug, entry]));
}

/**
 * Backlinks: articles whose `related` includes the given slug. The reverse
 * direction of every cross-reference, computed at build time.
 */
export async function backlinksTo(slug: string): Promise<WikiEntry[]> {
  const articles = await allArticles();
  return articles.filter((entry) => entry.data.related.includes(slug));
}

export function wikiEnabled(): boolean {
  return isModuleEnabled('wiki');
}
