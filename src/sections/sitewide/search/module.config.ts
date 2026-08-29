import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Search module (Phase 5, sitewide); the discovery layer. Build-time JSON
 * indexes are generated from every enabled module's collection (consumed
 * via the public content-collection API, no module internals), plus the
 * registry's own pages. The /search/ page ships a self-contained Fuse.js
 * island that fetches the merged index once and then works offline.
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
