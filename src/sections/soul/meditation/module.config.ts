import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Ashtanga & Dhyan module (Phase 3, soul pillar). Distinct module id
 * ('soul-meditation') because the mind pillar already owns 'meditation';
 * public route is /soul/meditation/ per the sitemap. Shares the soul-paths
 * implementation and `soul-teachings` collection (see soul/paths/).
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'soul-meditation',
  parent: 'soul',
  title: 'Ashtanga & Dhyan',
  description:
    'The eight limbs of Patañjali\'s yoga and the heart of meditation, the map on which every practice on this site sits.',
  routePrefix: '/soul/meditation/',
  enabled: true,
  accent: 'plum',
};

export default config;
