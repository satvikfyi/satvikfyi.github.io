import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Bhakti Yoga module (Phase 3, soul pillar). Shares the soul-paths
 * implementation and `soul-teachings` collection (see soul/paths/).
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'devotion',
  parent: 'soul',
  title: 'Bhakti Yoga',
  description:
    'The path of devotion, the great verses of love from the Gītā to Nārada, and the life of kīrtana.',
  routePrefix: '/soul/devotion/',
  enabled: true,
  accent: 'plum',
};

export default config;
