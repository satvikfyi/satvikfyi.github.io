/**
 * Versioned, namespaced localStorage wrapper.
 *
 * Shared utility (no domain logic) used today by the meal planner island
 * and later by the dosha quiz and other interactive islands.
 *
 * - Keys are namespaced: `satvikfyi:v{version}:{scope}` so a schema change
 *   can bump the version and orphan old data instead of corrupting reads.
 * - All access is wrapped: private-browsing modes, disabled storage and
 *   SSR must never throw or break the page.
 * - Values are JSON; a failed parse returns the fallback, never an error.
 */

export interface LocalStore<T> {
  /** Fully-qualified storage key (useful for debugging). */
  readonly key: string;
  get(): T | null;
  set(value: T): void;
  remove(): void;
}

const PREFIX = 'satvikfyi';

function storage(): Storage | null {
  if (typeof window === 'undefined' || !('localStorage' in window)) return null;
  try {
    const probe = window.localStorage;
    probe.setItem(`${PREFIX}:probe`, '1');
    probe.removeItem(`${PREFIX}:probe`);
    return probe;
  } catch {
    return null;
  }
}

export function createStore<T>(scope: string, version = 1): LocalStore<T> {
  const key = `${PREFIX}:v${version}:${scope}`;

  return {
    key,
    get(): T | null {
      const s = storage();
      if (!s) return null;
      try {
        const raw = s.getItem(key);
        return raw === null ? null : (JSON.parse(raw) as T);
      } catch {
        return null;
      }
    },
    set(value: T): void {
      const s = storage();
      if (!s) return;
      try {
        s.setItem(key, JSON.stringify(value));
      } catch {
        /* quota exceeded or blocked, persistence is a convenience, never a requirement */
      }
    },
    remove(): void {
      const s = storage();
      if (!s) return;
      try {
        s.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}
