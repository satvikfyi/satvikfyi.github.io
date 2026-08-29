import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Gyan Yoga module (Phase 3, soul pillar). Shares the soul-paths
 * implementation and `soul-teachings` collection (see soul/paths/).
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'knowledge',
  parent: 'soul',
  title: 'Gyan Yoga',
  description:
    'The path of knowledge, discernment, inquiry and the great sayings of the Upaniṣads.',
  routePrefix: '/soul/knowledge/',
  enabled: true,
  accent: 'plum',
};

export default config;
