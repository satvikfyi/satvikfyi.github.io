/**
 * Meditation module domain, pure constants, types and label maps.
 * Client-safe (this module ships no island, but the pattern holds).
 */

export const PRACTICE_KINDS = ['practice', 'concept'] as const;
export type PracticeKind = (typeof PRACTICE_KINDS)[number];

export const kindLabel: Record<PracticeKind, string> = {
  practice: 'Practice',
  concept: 'Concept',
};
