import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Yoga module (Phase 2), the asana database: a Zod-validated collection of
 * poses with Sanskrit names, steps, benefits, contraindications and dosha
 * associations; a filterable listing and detail pages with video guidance.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'yoga',
  parent: 'body',
  title: 'Yogasana',
  description:
    'A growing database of asanas with Sanskrit names, steps, benefits and contraindications, each noting the doshas it traditionally helps balance.',
  routePrefix: '/body/yoga/',
  enabled: true,
  accent: 'saffron',
};

export default config;
