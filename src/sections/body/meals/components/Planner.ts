/**
 * Planner island, the interactive half of /body/meals/planner/.
 *
 * The server renders a full sample plan (so the page works without
 * JavaScript); this script takes over: dosha selection (seeded from the
 * shared dosha-quiz result when present), 7-day generation favouring
 * dosha-balancing recipes, per-slot swaps, localStorage persistence and a
 * re-aggregated shopping list.
 *
 * Persistence uses the shared createStore utility:
 *   plan: `satvikfyi:v1:meals-planner`   (shape: lib/plan.ts Plan)
 *   quiz: `satvikfyi:v1:quiz-result`     (read-only; shape { dosha, date })
 */
import { createStore } from '../../../../shared/utils/localStorageStore';
import {
  PLAN_MEALS,
  generatePlan,
  planIsValid,
  planRecipes,
  swapSlot,
  type Plan,
  type PlanMeal,
  type PlannerRecipe,
} from '../lib/plan';
import { buildShoppingList } from '../lib/shoppingList';
import { doshaLabel, isDosha, mealTypeLabel } from '../lib/domain';

interface Payload {
  recipes: PlannerRecipe[];
  /** Server-rendered sample plan (always dosha "vata"). */
  plan: Plan;
}

const planStore = createStore<Plan>('meals-planner', 1);
const quizStore = createStore<{ dosha: string; date?: string }>('quiz-result', 1);

export function mountPlanner(root: HTMLElement | null): void {
  if (!root) return;

  const dataEl = document.getElementById('planner-data');
  const tbody = document.getElementById('plan-body');
  const shoppingList = document.getElementById('shopping-list');
  const controls = document.getElementById('planner-controls');
  const status = document.getElementById('planner-status');
  if (!dataEl || !tbody || !shoppingList) return;

  let payload: Payload;
  try {
    payload = JSON.parse(dataEl.textContent ?? '{}') as Payload;
  } catch {
    return;
  }
  if (!Array.isArray(payload.recipes) || payload.recipes.length === 0) return;

  const bySlug = new Map(payload.recipes.map((r) => [r.slug, r]));
  const detailHref = (slug: string): string => `/body/meals/recipes/${slug}/`;
  let plan: Plan = payload.plan;

  const announce = (message: string): void => {
    if (status) status.textContent = message;
  };

  const renderPlan = (): void => {
    tbody.replaceChildren(
      ...plan.days.map((day) => {
        const row = document.createElement('tr');
        row.className = 'border-t border-sand align-top';

        const dayHeader = document.createElement('th');
        dayHeader.scope = 'row';
        dayHeader.className = 'py-3 pr-4 text-left text-sm font-semibold text-earth';
        dayHeader.textContent = `Day ${day.day}`;
        row.append(dayHeader);

        for (const meal of PLAN_MEALS) {
          const cell = document.createElement('td');
          cell.className = 'py-3 pr-4';

          const holder = document.createElement('div');
          holder.className = 'flex items-start justify-between gap-2';

          const link = document.createElement('a');
          link.href = detailHref(day.meals[meal]);
          link.className = 'text-sm font-medium text-earth underline decoration-sage/50 underline-offset-2 hover:decoration-sage-deep';
          link.textContent = bySlug.get(day.meals[meal])?.title ?? day.meals[meal];
          holder.append(link);

          const swap = document.createElement('button');
          swap.type = 'button';
          swap.dataset.swap = '';
          swap.dataset.day = String(day.day);
          swap.dataset.meal = meal;
          swap.className =
            'no-print shrink-0 rounded-full border border-sand px-2 py-0.5 text-xs font-medium text-clay transition-colors hover:border-sage/60 hover:text-sage-deep';
          swap.setAttribute('aria-label', `Swap ${mealTypeLabel[meal]} on day ${day.day}`);
          swap.title = `Swap ${mealTypeLabel[meal].toLowerCase()} on day ${day.day}`;
          swap.textContent = '⇄ swap';
          holder.append(swap);

          cell.append(holder);
          row.append(cell);
        }
        return row;
      }),
    );

    const checked = root.querySelector<HTMLInputElement>(`input[name="planner-dosha"][value="${plan.dosha}"]`);
    if (checked) checked.checked = true;

    // Keep the caption beside the heading in sync with the active dosha
    // (the server-rendered text describes only the sample plan).
    const note = document.getElementById('plan-dosha-note');
    if (note) {
      note.replaceChildren(
        'Favouring ',
        Object.assign(document.createElement('span'), {
          className: 'font-semibold text-earth capitalize',
          textContent: `${doshaLabel[plan.dosha]}-balancing`,
        }),
        ' dishes',
      );
    }
  };

  const renderShoppingList = (): void => {
    const entries = buildShoppingList(planRecipes(plan, payload.recipes));
    shoppingList.replaceChildren(
      ...entries.map((entry, index) => {
        const item = document.createElement('li');
        item.className = 'break-inside-avoid';

        const label = document.createElement('label');
        label.className = 'flex items-baseline gap-3 text-sm leading-relaxed text-earth';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `shopping-item-${index}`;
        checkbox.className = 'mt-0.5 h-4 w-4 shrink-0 accent-sage-deep';
        label.append(checkbox);

        const text = document.createElement('span');
        const name = document.createElement('strong');
        name.className = 'font-semibold';
        name.textContent = entry.item;
        text.append(name, `; ${entry.quantities.join(' + ')}`);
        label.append(text);

        item.append(label);
        return item;
      }),
    );
  };

  const commit = (next: Plan, message: string): void => {
    plan = next;
    planStore.set(plan);
    renderPlan();
    renderShoppingList();
    announce(message);
  };

  // Initial dosha: URL param → saved plan → quiz result → SSR default.
  const params = new URLSearchParams(window.location.search);
  const saved = planStore.get();
  const quiz = quizStore.get();
  const urlDosha = params.get('dosha');
  const urlValid = urlDosha !== null && isDosha(urlDosha) ? urlDosha : null;
  const quizDosha = quiz && isDosha(quiz.dosha) ? quiz.dosha : null;

  const hasSaved = planIsValid(saved, payload.recipes);
  if (hasSaved) plan = saved;

  // A quiz result saved after the current plan wins: taking (or retaking)
  // the quiz re-defaults the planner on the next visit. A plan regenerated
  // or edited after the quiz keeps its own dosha, the planner never
  // overrides deliberate choices.
  const quizDate = quiz ? Date.parse(quiz.date ?? '') : NaN;
  const planDate = hasSaved ? Date.parse(saved.generatedAt) : NaN;
  const quizOutranksPlan =
    quizDosha !== null &&
    quizDosha !== plan.dosha &&
    (!hasSaved || (Number.isFinite(quizDate) && (!Number.isFinite(planDate) || quizDate > planDate)));

  let quizApplied = false;

  if (urlValid && urlValid !== plan.dosha) {
    plan = generatePlan(payload.recipes, urlValid);
    planStore.set(plan);
  } else if (quizOutranksPlan) {
    plan = generatePlan(payload.recipes, quizDosha);
    planStore.set(plan);
    quizApplied = true;
  } else if (!hasSaved) {
    // Adopt (and persist) the server-rendered sample so reload keeps it.
    planStore.set(plan);
  }

  renderPlan();
  renderShoppingList();

  if (urlValid && urlValid !== plan.dosha) announce(`Favouring ${doshaLabel[urlValid]}-balancing dishes.`);
  else if (quizApplied || (!hasSaved && quizDosha && quizDosha === plan.dosha)) {
    announce(`Quiz result applied, favouring ${doshaLabel[plan.dosha]}-balancing dishes.`);
  }

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === 'planner-dosha' && isDosha(target.value)) {
      commit(
        generatePlan(payload.recipes, target.value),
        `Week regenerated to favour ${doshaLabel[target.value]}-balancing dishes.`,
      );
    }
  });

  tbody.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-swap]');
    if (!button) return;
    const day = Number(button.dataset.day);
    const meal = button.dataset.meal as PlanMeal;
    if (!Number.isInteger(day) || !(PLAN_MEALS as readonly string[]).includes(meal)) return;
    const next = swapSlot(payload.recipes, plan, day, meal);
    const title = bySlug.get(next.days.find((d) => d.day === day)?.meals[meal] ?? '')?.title ?? '';
    commit(next, title ? `Swapped ${mealTypeLabel[meal].toLowerCase()} on day ${day} for ${title}.` : '');
  });

  document.getElementById('regenerate')?.addEventListener('click', () => {
    commit(
      generatePlan(payload.recipes, plan.dosha),
      `Week regenerated to favour ${doshaLabel[plan.dosha]}-balancing dishes.`,
    );
  });

  document.getElementById('print-list')?.addEventListener('click', () => {
    const cleanup = (): void => document.body.classList.remove('printing-list');
    document.body.classList.add('printing-list');
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
    setTimeout(cleanup, 30_000);
  });

  controls?.removeAttribute('hidden');
}
