// Route entry for /search/{id}.json, per-collection index chunks, built at
// build time (meals-recipes, yoga-poses, …, pages). The merged index lives
// at /search/index.json; chunks exist for budget-conscious consumers.
import type { APIRoute } from 'astro';
import { buildChunks, searchEnabled } from '../../sections/sitewide/search/lib/index-builder';

export function getStaticPaths() {
  if (!searchEnabled()) return [];
  // Chunk ids are known only after the collections load, so we resolve them
  // eagerly here and let Astro build one file per chunk.
  return buildChunks().then((chunks) => chunks.map((chunk) => ({ params: { id: chunk.id } })));
}

export const GET: APIRoute = async ({ params }) => {
  const chunks = await buildChunks();
  const chunk = chunks.find((c) => c.id === params.id);
  if (!chunk) return new Response(null, { status: 404 });
  return new Response(JSON.stringify(chunk.docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
