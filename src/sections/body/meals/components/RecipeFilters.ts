/**
 * RecipeFilters island, client-side filtering of the server-rendered
 * recipe grid. Self-contained vanilla TS: no framework. The grid is fully
 * rendered in HTML, so without JavaScript every recipe is visible; this
 * script only toggles visibility.
 *
 * Supports deep links: /body/meals/?dosha=vata&meal=breakfast&season=…
 * With no ?dosha= in the URL, a saved dosha-quiz result (shared store,
 * written by the /quiz/ module) quietly becomes the default, reading the
 * shared store is the sanctioned integration point between modules.
 */
import { createStore } from '../../../../shared/utils/localStorageStore';
import { isDosha } from '../lib/domain';

const quizStore = createStore<{ dosha: string; date?: string }>('quiz-result', 1);

interface FilterState {
  dosha: string;
  meal: string;
  season: string;
  tag: string;
}

const PARAM_KEYS: Record<keyof FilterState, string> = {
  dosha: 'dosha',
  meal: 'meal',
  season: 'season',
  tag: 'tag',
};

function cardMatches(card: HTMLElement, state: FilterState): boolean {
  if (state.meal && card.dataset.meal !== state.meal) return false;

  if (state.dosha) {
    const effect = card.dataset[state.dosha];
    if (effect !== 'balancing') return false;
  }

  if (state.season) {
    const seasons = (card.dataset.seasons ?? '').split(',');
    if (!seasons.includes(state.season) && !seasons.includes('all-year')) return false;
  }

  if (state.tag) {
    const tags = (card.dataset.tags ?? '').split(',');
    if (!tags.includes(state.tag)) return false;
  }

  return true;
}

export function mountFilters(panel: HTMLElement | null): void {
  if (!panel) return;

  const grid = document.getElementById('recipe-grid');
  const count = document.getElementById('recipe-count');
  const clear = document.getElementById('filter-clear') as HTMLButtonElement | null;
  if (!grid || !count) return;

  const selects: Record<keyof FilterState, HTMLSelectElement | null> = {
    dosha: document.getElementById('filter-dosha') as HTMLSelectElement | null,
    meal: document.getElementById('filter-meal') as HTMLSelectElement | null,
    season: document.getElementById('filter-season') as HTMLSelectElement | null,
    tag: document.getElementById('filter-tag') as HTMLSelectElement | null,
  };

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-recipe-card]'));
  const total = cards.length;

  const readState = (): FilterState => ({
    dosha: selects.dosha?.value ?? '',
    meal: selects.meal?.value ?? '',
    season: selects.season?.value ?? '',
    tag: selects.tag?.value ?? '',
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
        ? `Showing all ${total} recipes`
        : `Showing ${visible} of ${total} recipes`;

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

  // Deep link (?dosha=vata) wins over the default selects; otherwise a
  // saved quiz result seeds the dosha select so returning visitors land on
  // recipes that suit them.
  const params = new URLSearchParams(window.location.search);
  const urlDosha = params.get('dosha');
  let quizApplied = false;
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
