import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Search module (Phase 5, sitewide); the discovery layer. Pagefind
 * indexes the rendered site after every build (`pagefind --site dist`
 * is appended to `npm run build`), so full page content — recipe
 * ingredients, steps, prose — is searchable. The /search/ page ships a
 * self-contained island that loads the Pagefind runtime from
 * /pagefind/ once and then works offline. New modules need no search
 * wiring: their rendered pages are indexed automatically.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'search',
  parent: null,
  title: 'Search',
  description:
    'Search every recipe, asana, herb, breath, mantra and essay on the site; instantly, privately, offline after first load.',
  routePrefix: '/search/',
  enabled: true,
  accent: 'sage',
};

export default config;
