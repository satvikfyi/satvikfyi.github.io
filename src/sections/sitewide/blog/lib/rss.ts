/**
 * RSS feed builder for the blog module, module-owned logic, exposed to the
 * thin endpoint at src/pages/rss.xml.ts. Full content is included (the
 * posts are short and readers deserve them whole).
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../../../../config/site';
import { blogEnabled, publishedPosts } from './posts';

export async function GET(context: APIContext) {
  if (!blogEnabled()) return new Response(null, { status: 404 });
  const posts = await publishedPosts();
  return rss({
    title: `${SITE.name}: Blog`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: new Date(`${post.data.date}T00:00:00Z`),
      link: `/blog/${post.data.slug}/`,
      categories: post.data.tags,
      author: post.data.author,
    })),
    customData: '<language>en</language>',
  });
}
