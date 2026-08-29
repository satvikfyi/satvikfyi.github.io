import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Dosha quiz module (Phase 2, sitewide; no pillar). A multi-step
 * questionnaire island: client-side scoring determines the dominant dosha
 * and saves `{ dosha, date }` to the shared localStorageStore key
 * `satvikfyi:v1:quiz-result`, which the meals planner, meals/yoga/ayurveda
 * filters read (read-only) to personalise defaults.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'quiz',
  parent: null,
  title: 'Dosha Quiz',
  description:
    'A short questionnaire to reflect on your ayurvedic constitution, the result stays on your device and gently personalises the site.',
  routePrefix: '/quiz/',
  enabled: true,
  accent: 'sage',
};

export default config;
