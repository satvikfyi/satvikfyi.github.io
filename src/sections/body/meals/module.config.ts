import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Meals module, the first feature module (Phase 1: recipe database,
 * filters and the weekly planner island). Phase 0 ships only its manifest
 * and a coming-soon landing page so that every registry-driven surface and
 * link is green from day one.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'meals',
  parent: 'body',
  title: 'Satvik Meals',
  description:
    'Satvik recipes with dosha effects, and a weekly meal planner that saves plans on your device; never on a server.',
  routePrefix: '/body/meals/',
  enabled: true,
  accent: 'sage',
};

export default config;
