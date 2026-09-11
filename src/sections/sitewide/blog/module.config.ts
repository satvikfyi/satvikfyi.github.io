import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Blog module (Phase 4, sitewide); the long-form content engine. A post is
 * a single markdown file in content/posts/; the listing, post page, tag
 * pages, RSS feed and JSON-LD all derive from the collection. Comments are
 * opt-in per post (`comments: true`) and lazy-loaded via the Comments island.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'blog',
  parent: null,
  title: 'Blog',
  description:
    'Essays and notes on living satvik today, food, breath, practice and the traditions behind them.',
  routePrefix: '/blog/',
  enabled: true,
  accent: 'sage',
};

export default config;
