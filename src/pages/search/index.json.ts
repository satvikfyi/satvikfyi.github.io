// Route entry for /search/index.json, the merged search index, built at
// build time from every enabled module's public collection API.
import type { APIRoute } from 'astro';
import { mergedIndex, searchEnabled } from '../../sections/sitewide/search/lib/index-builder';

export const GET: APIRoute = async () => {
  if (!searchEnabled()) return new Response(null, { status: 404 });
  const docs = await mergedIndex();
  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
