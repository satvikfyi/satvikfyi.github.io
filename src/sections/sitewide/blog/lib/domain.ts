/**
 * Blog module domain, pure helpers shared by pages, the RSS endpoint and
 * the listing. No Astro imports (client-safe where needed).
 */

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Tag pages live at /blog/tag/{tag}/, tags are kebab-case slugs. */
export function tagHref(tag: string): string {
  return `/blog/tag/${tag}/`;
}

export const tagKebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
