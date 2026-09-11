import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Karma Yoga module (Phase 3, soul pillar). The five soul path modules share
 * one implementation and one content collection (`soul-teachings`) under
 * src/sections/soul/paths/, this manifest registers the path's public face.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'action',
  parent: 'soul',
  title: 'Karma Yoga',
  description:
    'The path of action, work offered rather than traded, taught through the Bhagavad Gītā\'s own verses.',
  routePrefix: '/soul/action/',
  enabled: true,
  accent: 'plum',
};

export default config;
