/**
 * Planner logic, pure functions shared by the server-rendered sample plan
 * and the client island. No DOM, no Astro imports.
 */
import type { Dosha, DoshaEffects, MealType } from './domain';
import { DOSHAS } from './domain';

/** Minimal serializable recipe subset the planner and shopping list need. */
export interface PlannerIngredient {
  item: string;
  quantity?: string;
}

export interface PlannerRecipe {
  slug: string;
  title: string;
  mealType: MealType;
  servings: number;
  doshaEffects: DoshaEffects;
  ingredients: PlannerIngredient[];
}

export const PLAN_MEALS = ['breakfast', 'lunch', 'dinner'] as const;
export type PlanMeal = (typeof PLAN_MEALS)[number];
export type MealSlots = Record<PlanMeal, string>;

export interface DayPlan {
  /** 1–7. */
  day: number;
  meals: MealSlots;
}

export interface Plan {
  dosha: Dosha;
  /** ISO timestamp of the last generation, informational. */
  generatedAt: string;
  days: DayPlan[];
}

export const PLAN_DAYS = 7;

/** Small seeded RNG (mulberry32) so server renders are deterministic. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function isPlanMeal(mealType: MealType): mealType is PlanMeal {
  return (PLAN_MEALS as readonly string[]).includes(mealType);
}

/**
 * Score a recipe for a dosha: balancing 2, neutral 1, aggravating 0.
 * The plan generator prefers higher tiers and only falls through to
 * aggravating options when nothing else exists for that meal type.
 */
export function doshaScore(recipe: PlannerRecipe, dosha: Dosha): number {
  const effect = recipe.doshaEffects[dosha];
  return effect === 'balancing' ? 2 : effect === 'neutral' ? 1 : 0;
}

/**
 * Pool for one meal column: highest dosha tier first, shuffled within each
 * tier so every generation differs.
 */
function mealPool(recipes: readonly PlannerRecipe[], meal: PlanMeal, dosha: Dosha, rand: () => number): PlannerRecipe[] {
  const byTier = new Map<number, PlannerRecipe[]>();
  for (const recipe of recipes) {
    if (recipe.mealType !== meal || !isPlanMeal(recipe.mealType)) continue;
    const tier = doshaScore(recipe, dosha);
    byTier.set(tier, [...(byTier.get(tier) ?? []), recipe]);
  }
  return [...byTier.keys()]
    .sort((a, b) => b - a)
    .flatMap((tier) => shuffle(byTier.get(tier) ?? [], rand));
}

/**
 * Pick a recipe for a slot. The pool is ordered best-tier-first with
 * entries shuffled within each tier, so the first candidate is always the
 * strongest available choice, while still varying across regenerations
 * (the shuffle differs every time the pool is built). `usedSlugs` lets a
 * slot avoid recipes already used in the week's same meal column; when
 * everything is used, the pool is reused.
 */
function pickForSlot(
  pool: readonly PlannerRecipe[],
  usedSlugs: ReadonlySet<string>,
): PlannerRecipe {
  const fresh = pool.filter((r) => !usedSlugs.has(r.slug));
  const candidates = fresh.length > 0 ? fresh : pool;
  return candidates[0];
}

export function generatePlan(recipes: readonly PlannerRecipe[], dosha: Dosha, rand: () => number = Math.random): Plan {
  const days: DayPlan[] = [];
  for (let day = 1; day <= PLAN_DAYS; day++) {
    const meals = {} as MealSlots;
    for (const meal of PLAN_MEALS) {
      const used = new Set(days.flatMap((d) => [d.meals[meal]]));
      const picked = pickForSlot(mealPool(recipes, meal, dosha, rand), used);
      meals[meal] = picked.slug;
    }
    days.push({ day, meals });
  }
  return { dosha, generatedAt: new Date().toISOString(), days };
}

/**
 * Swap a single slot. The outgoing recipe is explicitly excluded, then the
 * usual tier + no-repeat preference applies.
 */
export function swapSlot(
  recipes: readonly PlannerRecipe[],
  plan: Plan,
  day: number,
  meal: PlanMeal,
  rand: () => number = Math.random,
): Plan {
  const current = plan.days.find((d) => d.day === day);
  if (!current) return plan;
  const outgoing = current.meals[meal];
  const used = new Set(plan.days.map((d) => d.meals[meal]));
  used.add(outgoing);
  const pool = mealPool(recipes, meal, plan.dosha, rand);
  if (pool.length === 0) return plan;
  const picked = pickForSlot(pool, used);
  return {
    ...plan,
    days: plan.days.map((d) => (d.day === day ? { ...d, meals: { ...d.meals, [meal]: picked.slug } } : d)),
  };
}

/** Recipes referenced by a plan (slug → recipe), for rendering and lists. */
export function planRecipes(plan: Plan, recipes: readonly PlannerRecipe[]): PlannerRecipe[] {
  const bySlug = new Map(recipes.map((r) => [r.slug, r]));
  return plan.days.flatMap((d) =>
    PLAN_MEALS.map((meal) => bySlug.get(d.meals[meal])).filter((r): r is PlannerRecipe => !!r),
  );
}

/** Guard used when loading persisted plans, slugs may vanish from content. */
export function planIsValid(value: unknown, recipes: readonly PlannerRecipe[]): value is Plan {
  if (typeof value !== 'object' || value === null) return false;
  const plan = value as Partial<Plan>;
  if (!DOSHAS.includes(plan.dosha as Dosha)) return false;
  if (!Array.isArray(plan.days) || plan.days.length !== PLAN_DAYS) return false;
  const slugs = new Set(recipes.map((r) => r.slug));
  return plan.days.every(
    (d) =>
      typeof d?.day === 'number' &&
      !!d.meals &&
      PLAN_MEALS.every((meal) => typeof d.meals[meal] === 'string' && slugs.has(d.meals[meal])),
  );
}
