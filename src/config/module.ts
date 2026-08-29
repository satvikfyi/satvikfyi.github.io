/**
 * The module contract, expressed as types.
 *
 * Every section of the site, the three pillars and every feature module; 
 * ships a `module.config.ts` manifest that satisfies one of these shapes.
 * The central registry (src/config/sections.ts) aggregates the manifests and
 * is the ONLY thing that navbar, footer, pillar landing pages and the
 * sitemap render from.
 */

/** The three fixed top-level pillars. */
export type PillarId = 'body' | 'mind' | 'soul';

/**
 * Design-token accent a section is rendered with. Components map these to
 * static class lists (never to dynamically-built class names, which the
 * Tailwind build would not see).
 */
export type AccentToken = 'saffron' | 'sage' | 'indigo' | 'plum';

export interface BaseSectionConfig {
  /** Unique, kebab-case. Used as registry key and collection namespace root. */
  id: string;
  title: string;
  /** One-to-two sentence description used in nav surfaces, cards and listings. */
  description: string;
  /** Route prefix; must start and end with a slash, e.g. "/body/meals/". */
  routePrefix: string;
  /** When false the section is removed from every registry-driven surface. */
  enabled: boolean;
  /** Hide from navigation even when enabled (registry still lists it). */
  navHidden?: boolean;
  accent?: AccentToken;
}

export interface PillarSectionConfig extends BaseSectionConfig {
  kind: 'pillar';
  /** Pillar ids are the fixed set: body, mind, soul. */
  id: PillarId;
  parent: null;
}

export interface ModuleSectionConfig extends BaseSectionConfig {
  kind: 'module';
  /** The pillar this module registers under, or null for sitewide modules. */
  parent: PillarId | null;
  /**
   * True when a module is registered ahead of its build phase (a placeholder
   * in the roadmap). Placeholder modules are always disabled and never render.
   */
  placeholder?: boolean;
}

export type SectionConfig = PillarSectionConfig | ModuleSectionConfig;
