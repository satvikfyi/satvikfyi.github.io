/**
 * Collection helpers for the blog module, the single source of truth for
 * "which posts are published" so the listing, tag pages and RSS can never
 * disagree. Server-side only (imports astro:content).
 */
import { getCollection } from 'astro:content';
import { isModuleEnabled } from '../../../../config/sections';
import type { Post } from '../schemas/post';

export interface PostEntry {
  data: Post;
}

/** Published posts (drafts excluded), newest first. */
export async function publishedPosts(): Promise<PostEntry[]> {
  const entries = await getCollection('blog-posts', (entry) => !entry.data.draft);
  return entries.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

/** All tags in use, alphabetically, with their post counts. */
export async function tagCounts(): Promise<{ tag: string; count: number }[]> {
  const posts = await publishedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, 'en'));
}

/** Empty when the module is disabled, used by getStaticPaths and RSS. */
export function blogEnabled(): boolean {
  return isModuleEnabled('blog');
}
