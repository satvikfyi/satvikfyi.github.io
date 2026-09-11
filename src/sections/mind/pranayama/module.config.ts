import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Pranayama module (Phase 3), the breathing-technique database. Every
 * technique carries mandatory safety contraindications (schema-enforced,
 * min 1) and teacher guidance for advanced practices; the pages render the
 * shared pranayama safety disclaimer.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'pranayama',
  parent: 'mind',
  title: 'Pranayama',
  description:
    'Classical breathing techniques with rhythms, benefits and mandatory safety notes; breathwork learned gently, never strained.',
  routePrefix: '/mind/pranayama/',
  enabled: true,
  accent: 'indigo',
};

export default config;
