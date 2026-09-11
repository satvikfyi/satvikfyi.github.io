/**
 * Soul paths shared domain, the five soul-pillar paths and their labels.
 *
 * The five soul modules (action, knowledge, devotion, soul-meditation,
 * tantra) share one implementation and one content collection
 * (`soul-teachings`), keyed by `path`; the Phase 3 brief explicitly allows
 * this ("soul paths may share one 'paths' module internally").
 */

export const SOUL_PATHS = ['action', 'knowledge', 'devotion', 'meditation', 'tantra'] as const;
export type SoulPath = (typeof SOUL_PATHS)[number];

/** Registry module id for each path (soul's meditation module has its own id). */
export const pathModuleId: Record<SoulPath, string> = {
  action: 'action',
  knowledge: 'knowledge',
  devotion: 'devotion',
  meditation: 'soul-meditation',
  tantra: 'tantra',
};
