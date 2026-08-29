/**
 * Accent → static class-fragment maps.
 *
 * Tailwind only compiles class names it can see as complete strings, so
 * accent styling is selected from these records, never assembled from
 * dynamic pieces.
 */
import type { AccentToken } from '../../config/module';

export const accentText: Record<AccentToken, string> = {
  saffron: 'text-saffron-deep',
  sage: 'text-sage-deep',
  indigo: 'text-indigo-deep',
  plum: 'text-plum-deep',
};

export const accentTag: Record<AccentToken, string> = {
  saffron: 'bg-saffron/15 text-saffron-deep',
  sage: 'bg-sage/15 text-sage-deep',
  indigo: 'bg-indigo/15 text-indigo-deep',
  plum: 'bg-plum/15 text-plum-deep',
};

export const accentCard: Record<AccentToken, string> = {
  saffron: 'hover:border-saffron/60',
  sage: 'hover:border-sage/60',
  indigo: 'hover:border-indigo/60',
  plum: 'hover:border-plum/60',
};

export const accentBar: Record<AccentToken, string> = {
  saffron: 'bg-saffron',
  sage: 'bg-sage',
  indigo: 'bg-indigo',
  plum: 'bg-plum',
};
