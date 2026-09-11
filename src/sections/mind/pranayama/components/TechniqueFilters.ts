/**
 * TechniqueFilters island, client-side filtering of the server-rendered
 * pranayama grid. Self-contained vanilla TS; the grid is fully rendered in
 * HTML, so without JavaScript every technique is visible.
 *
 * Deep links: /mind/pranayama/?dosha=kapha&category=calming&level=beginner
 * With no ?dosha= in the URL, a saved dosha-quiz result (shared store)
 * quietly becomes the default.
 */
import { createStore } from '../../../../shared/utils/localStorageStore';
import { isDosha } from '../lib/domain';

interface FilterState {
  dosha: string;
  category: string;
  level: string;
}

const PARAM_KEYS: Record<keyof FilterState, string> = {
  dosha: 'dosha',
  category: 'category',
  level: 'level',
};

const quizStore = createStore<{ dosha: string; date?: string }>('quiz-result', 1);

function cardMatches(card: HTMLElement, state: FilterState): boolean {
  if (state.category && card.dataset.category !== state.category) return false;
  if (state.level && card.dataset.level !== state.level) return false;

  if (state.dosha) {
    const doshas = (card.dataset.doshas ?? '').split(',');
    if (!doshas.includes(state.dosha)) return false;
  }

  return true;
}

export function mountTechniqueFilters(panel: HTMLElement | null): void {
  if (!panel) return;

  const grid = document.getElementById('technique-grid');
  const count = document.getElementById('technique-count');
  const clear = document.getElementById('filter-clear') as HTMLButtonElement | null;
  if (!grid || !count) return;

  const selects: Record<keyof FilterState, HTMLSelectElement | null> = {
    dosha: document.getElementById('filter-dosha') as HTMLSelectElement | null,
    category: document.getElementById('filter-category') as HTMLSelectElement | null,
    level: document.getElementById('filter-level') as HTMLSelectElement | null,
  };

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-technique-card]'));
  const total = cards.length;
  let quizApplied = false;

  const readState = (): FilterState => ({
    dosha: selects.dosha?.value ?? '',
    category: selects.category?.value ?? '',
    level: selects.level?.value ?? '',
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
        ? `Showing all ${total} techniques`
        : `Showing ${visible} of ${total} techniques`;

    if (clear) clear.disabled = active === 0;

    const params = new URLSearchParams();
    for (const key of Object.keys(PARAM_KEYS) as (keyof FilterState)[]) {
      if (state[key]) params.set(PARAM_KEYS[key], state[key]);
    }
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  };

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
