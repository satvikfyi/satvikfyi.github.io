/**
 * Central section registry, the aggregation point of the hierarchical
 * module system.
 *
 * Rules (see docs/adding-a-module.md):
 *  - Every module ships a `module.config.ts` manifest inside its own folder
 *    and is wired here with a static import. Nothing else may reach into a
 *    module folder.
 *  - Navbar, footer, pillar landing pages and the sitemap render ONLY from
 *    this registry. Flipping `enabled: false` removes a module from all of
 *    them; its routes redirect to the parent pillar.
 *  - Future modules are parked as disabled placeholders (`placeholder: true`)
 *    until their phase replaces the placeholder with a real manifest import.
 */
import type {
  ModuleSectionConfig,
  PillarId,
  PillarSectionConfig,
  SectionConfig,
} from './module';
import bodyPillar from '../sections/body/module.config';
import meals from '../sections/body/meals/module.config';
import yoga from '../sections/body/yoga/module.config';
import ayurveda from '../sections/body/ayurveda/module.config';
import mindPillar from '../sections/mind/module.config';
import pranayama from '../sections/mind/pranayama/module.config';
import meditation from '../sections/mind/meditation/module.config';
import mantras from '../sections/mind/mantras/module.config';
import soulPillar from '../sections/soul/module.config';
import soulAction from '../sections/soul/action/module.config';
import soulKnowledge from '../sections/soul/knowledge/module.config';
import soulDevotion from '../sections/soul/devotion/module.config';
import soulMeditation from '../sections/soul/meditation/module.config';
import tantra from '../sections/soul/tantra/module.config';
import quiz from '../sections/sitewide/quiz/module.config';
import blog from '../sections/sitewide/blog/module.config';
import wiki from '../sections/sitewide/wiki/module.config';
import search from '../sections/sitewide/search/module.config';

/** Future modules, parked until their build phase. Keep ids unique. */
const placeholder = (config: Omit<ModuleSectionConfig, 'enabled' | 'placeholder'>): ModuleSectionConfig => ({
  ...config,
  enabled: false,
  placeholder: true,
});

const roadmap: ModuleSectionConfig[] = [
  // ── body ──────────────────────────────────────────────────────────
  // (yoga and ayurveda graduated from placeholders in Phase 2, imported above.)
  // ── mind ──────────────────────────────────────────────────────────
  // (pranayama, meditation and mantras graduated in Phase 3; imported above.)
  // ── soul ──────────────────────────────────────────────────────────
  // (the five soul paths graduated in Phase 3, imported above; they share
  //  one implementation under src/sections/soul/paths/.)
  // ── sitewide (no pillar) ─────────────────────────────────────────
  // (quiz Phase 2; blog & wiki Phase 4; search Phase 5, all imported above.)
];

/** The full registry. Order matters: pillar, then its modules, per pillar. */
export const sections: SectionConfig[] = [
  bodyPillar,
  meals,
  yoga,
  ayurveda,
  ...roadmap.filter((m) => m.parent === 'body'),
  mindPillar,
  pranayama,
  meditation,
  mantras,
  ...roadmap.filter((m) => m.parent === 'mind'),
  soulPillar,
  soulAction,
  soulKnowledge,
  soulDevotion,
  soulMeditation,
  tantra,
  ...roadmap.filter((m) => m.parent === 'soul'),
  quiz,
  blog,
  wiki,
  search,
  ...roadmap.filter((m) => m.parent === null),
];

export const pillars: PillarSectionConfig[] = sections.filter(
  (s): s is PillarSectionConfig => s.kind === 'pillar',
);

export const modules: ModuleSectionConfig[] = sections.filter(
  (s): s is ModuleSectionConfig => s.kind === 'module',
);

/** Enabled, non-placeholder modules; optionally filtered by pillar. */
export function enabledModules(parent?: PillarId | null): ModuleSectionConfig[] {
  return modules.filter(
    (m) => m.enabled && !m.placeholder && (parent === undefined || m.parent === parent),
  );
}

export function getSection(id: string): SectionConfig | undefined {
  return sections.find((s) => s.id === id);
}

export function isModuleEnabled(id: string): boolean {
  const section = getSection(id);
  return !!section && section.enabled;
}

/** Route prefixes that must be excluded from the sitemap (disabled modules). */
export const disabledRoutePrefixes: string[] = sections
  .filter((s) => !s.enabled)
  .map((s) => s.routePrefix);

export type { ModuleSectionConfig, PillarSectionConfig, SectionConfig, PillarId };
