import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Meditation module (Phase 3), dhyāna practices and the philosophy behind
 * them. A deliberately quiet module: no filter island, no client JS at all; 
 * the listing groups practices and concepts as static sections.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'meditation',
  parent: 'mind',
  title: 'Meditation',
  description:
    'Dhyāna practices and the philosophy beneath them, breath, gaze, kindness, witness; taught simply, with their sources.',
  routePrefix: '/mind/meditation/',
  enabled: true,
  accent: 'indigo',
};

export default config;
