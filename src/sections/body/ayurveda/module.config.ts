import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Ayurveda module (Phase 2), herbs and food-ingredient entries with
 * classical energetics: tastes (rasa), properties (guṇa/vīrya), dosha
 * effects, indications, contraindications and preparation, with sources and
 * a firm educational disclaimer on every page.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'ayurveda',
  parent: 'body',
  title: 'Ayurveda',
  description:
    'Herbs and kitchen ingredients with their classical ayurvedic energetics, tastes, properties, dosha effects and safe preparation; grounded in cited sources.',
  routePrefix: '/body/ayurveda/',
  enabled: true,
  accent: 'saffron',
};

export default config;
