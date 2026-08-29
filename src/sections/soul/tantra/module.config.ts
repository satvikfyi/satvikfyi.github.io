import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Tantra module (Phase 3, soul pillar). Introductory-only by design: the
 * page carries a content warning, frames the traditions through cited
 * scholarship, and points to living lineages for actual practice. Shares
 * the soul-paths implementation (see soul/paths/).
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'tantra',
  parent: 'soul',
  title: 'Tantra',
  description:
    'The tantric traditions introduced carefully, śakti, the body as temple, and honest scholarly framing with content guidance.',
  routePrefix: '/soul/tantra/',
  enabled: true,
  accent: 'plum',
};

export default config;
