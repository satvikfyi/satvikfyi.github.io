/**
 * EntryFilters island, client-side filtering of the server-rendered
 * ayurveda grid. Self-contained vanilla TS: no framework, no imports beyond
 * the module's own lib and the shared localStorageStore. The grid is fully
 * rendered in HTML, so without JavaScript every entry is visible.
 *
 * Deep links: /body/ayurveda/?dosha=vata&kind=herb
 * When no ?dosha= is given, a saved dosha-quiz result (shared store, written
 * by the /quiz/ module) quietly becomes the default, reading the shared
 * store is the sanctioned integration point between modules.
 */
import { createStore } from '../../../../shared/utils/localStorageStore';
import { isDosha } from '../lib/domain';

interface FilterState {
  dosha: string;
  kind: string;
}

const PARAM_KEYS: Record<keyof FilterState, string> = {
  dosha: 'dosha',
  kind: 'kind',
};

const quizStore = createStore<{ dosha: string; date?: string }>('quiz-result', 1);

function cardMatches(card: HTMLElement, state: FilterState): boolean {
  if (state.kind && card.dataset.kind !== state.kind) return false;

  if (state.dosha) {
    const effect = card.dataset[state.dosha];
    if (effect !== 'balancing') return false;
  }

  return true;
}

export function mountEntryFilters(panel: HTMLElement | null): void {
  if (!panel) return;

  const grid = document.getElementById('entry-grid');
  const count = document.getElementById('entry-count');
  const clear = document.getElementById('filter-clear') as HTMLButtonElement | null;
  if (!grid || !count) return;

  const selects: Record<keyof FilterState, HTMLSelectElement | null> = {
    dosha: document.getElementById('filter-dosha') as HTMLSelectElement | null,
    kind: document.getElementById('filter-kind') as HTMLSelectElement | null,
  };

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-entry-card]'));
  const total = cards.length;
  let quizApplied = false;

  const readState = (): FilterState => ({
    dosha: selects.dosha?.value ?? '',
    kind: selects.kind?.value ?? '',
  });

  const apply = (): void => {
    const state = readState();
    let visible = 0;
    for (const card of cards) {
      const show = cardMatches(card, state);
      card.hidden = !show;
      if (show) visible++;
    }

    const active = Object.values(state).filter(Boolean).length;
    count.textContent =
      active === 0
        ? `Showing all ${total} entries`
        : `Showing ${visible} of ${total} entries`;

    if (clear) clear.disabled = active === 0;

    // Keep the URL shareable without adding history entries.
    const params = new URLSearchParams();
    for (const key of Object.keys(PARAM_KEYS) as (keyof FilterState)[]) {
      if (state[key]) params.set(PARAM_KEYS[key], state[key]);
    }
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState(null, '', nextUrl);
  };

  // Deep link (?dosha=vata) wins; otherwise a saved quiz result seeds the
  // dosha select so returning visitors land on entries that suit them.
  const params = new URLSearchParams(window.location.search);
  const urlDosha = params.get('dosha');
  if (!urlDosha) {
    const quiz = quizStore.get();
    if (quiz && isDosha(quiz.dosha) && selects.dosha) {
      selects.dosha.value = quiz.dosha;
      quizApplied = true;
    }
  }

  for (const key of Object.keys(PARAM_KEYS) as (keyof FilterState)[]) {
    const value = params.get(PARAM_KEYS[key]);
    const select = selects[key];
    if (select && value && [...select.options].some((o) => o.value === value)) {
      select.value = value;
    }
  }

  for (const select of Object.values(selects)) {
    select?.addEventListener('change', apply);
  }
  clear?.addEventListener('click', () => {
    for (const select of Object.values(selects)) {
      if (select) select.value = '';
    }
    quizApplied = false;
    apply();
  });

  panel.hidden = false;
  apply();

  if (quizApplied) {
    const note = document.getElementById('quiz-applied-note');
    if (note) note.hidden = false;
  }
}
