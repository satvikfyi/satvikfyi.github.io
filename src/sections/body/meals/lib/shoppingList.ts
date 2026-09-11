/**
 * Shopping-list aggregation, group a plan's ingredients by item and sum
 * quantities per unit. Pure, client-safe (used by SSR and the island).
 */
import type { PlannerIngredient, PlannerRecipe } from './plan';

export interface ShoppingEntry {
  /** Canonical display name, e.g. "Basmati rice". */
  item: string;
  /** Summed quantities per unit, e.g. ["1½ cups", "2 tbsp"], or notes like "to taste". */
  quantities: string[];
}

const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5,
  '¼': 0.25,
  '¾': 0.75,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '⅛': 0.125,
};

export interface ParsedQuantity {
  amount: number;
  unit: string;
}

/**
 * Parse a human quantity string like "1 cup", "1½ cups", "1 1/2 cups",
 * "2 tbsp", "1 inch piece" into amount + unit. Returns null when there is
 * no leading amount ("to taste", "a pinch", "as needed").
 */
export function parseQuantity(raw: string | undefined): ParsedQuantity | null {
  if (!raw) return null;
  const text = raw.trim();

  let amount = 0;
  let rest = text;
  let matched = false;

  // Leading unicode vulgar fraction, optionally followed by "n/d" or nothing.
  const fractionMatch = rest.match(/^(\d+(?:\s+\d+\/\d+)?\s*)?([½¼¾⅓⅔⅛])(.*)$/u);
  if (fractionMatch) {
    if (fractionMatch[1]) {
      const whole = Number(fractionMatch[1].trim().split(/\s+/)[0]);
      const fracPart = fractionMatch[1].trim().match(/(\d+)\/(\d+)$/);
      amount = (Number.isFinite(whole) ? whole : 0) + (fracPart ? Number(fracPart[1]) / Number(fracPart[2]) : 0);
    }
    amount += UNICODE_FRACTIONS[fractionMatch[2]] ?? 0;
    rest = fractionMatch[3].trim();
    matched = true;
  } else {
    // Plain decimal or "n/d" or "n n/d" amount.
    const plain = rest.match(/^(\d+\/\d+|\d+(?:\.\d+)?(?:\s+\d+\/\d+)?)\s*(.*)$/u);
    if (plain) {
      const [wholePart, fracPart] = plain[1].split(/\s+/);
      const whole = wholePart.includes('/') ? 0 : Number(wholePart);
      const fraction = wholePart.includes('/')
        ? Number(wholePart.split('/')[0]) / Number(wholePart.split('/')[1])
        : fracPart && fracPart.includes('/')
          ? Number(fracPart.split('/')[0]) / Number(fracPart.split('/')[1])
          : 0;
      amount = whole + fraction;
      rest = plain[2].trim();
      matched = true;
    }
  }

  if (!matched || !Number.isFinite(amount) || amount <= 0) return null;
  return { amount, unit: rest === '' ? '' : rest };
}

/** Format an amount using unicode fractions where exact (1.5 → "1½"). */
export function formatAmount(amount: number): string {
  const rounded = Math.round(amount * 8) / 8;
  const whole = Math.floor(rounded);
  const frac = rounded - whole;
  const fracText =
    frac === 0 ? '' : frac === 0.125 ? '⅛' : frac === 0.25 ? '¼' : frac === 1 / 3 ? '⅓' : frac === 0.375 ? '⅜' : frac === 0.5 ? '½' : frac === 0.625 ? '⅝' : frac === 2 / 3 ? '⅔' : frac === 0.75 ? '¾' : frac === 0.875 ? '⅞' : null;
  if (fracText !== null) return `${whole === 0 && fracText ? '' : whole}${fracText}`;
  // Fall back to a short decimal (e.g. 1.35 cups → "1.35").
  return `${Number(rounded.toFixed(2))}`;
}

/** Fold common plural units so "1 cup" and "2 cups" sum into one group. */
const UNIT_SINGULAR: Record<string, string> = {
  cups: 'cup',
  tablespoons: 'tablespoon',
  teaspoons: 'teaspoon',
  pinches: 'pinch',
  pieces: 'piece',
};

const UNIT_PLURAL: Record<string, string> = {
  cup: 'cups',
  tablespoon: 'tablespoons',
  teaspoon: 'teaspoons',
  pinch: 'pinches',
  piece: 'pieces',
};

function normalizeUnit(unit: string): string {
  const key = unit.trim().toLocaleLowerCase('en');
  return UNIT_SINGULAR[key] ?? key;
}

/** Readable unit for a summed amount ("1½ cups", "½ cup", "2 tbsp"; tsp/tbsp stay short). */
function displayUnit(unit: string, amount: number): string {
  if (amount <= 1) return unit;
  return UNIT_PLURAL[unit] ?? unit;
}

function formatQuantity(amount: number, unit: string): string {
  if (unit === '') return formatAmount(amount);
  return `${formatAmount(amount)} ${displayUnit(unit, amount)}`;
}

/** Normalize an item name for grouping ("Basmati Rice" == "basmati rice"). */
function groupKey(item: string): string {
  return item.trim().toLocaleLowerCase('en').replace(/\s+/g, ' ');
}

/**
 * Aggregate ingredients across recipes: one entry per canonical item, with
 * quantities summed per unit. Unparseable quantities ("to taste") are kept
 * verbatim so nothing is lost.
 */
export function buildShoppingList(recipes: readonly PlannerRecipe[]): ShoppingEntry[] {
  const items = new Map<string, { item: string; units: Map<string, number>; notes: string[] }>();

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients as readonly PlannerIngredient[]) {
      const key = groupKey(ingredient.item);
      let entry = items.get(key);
      if (!entry) {
        entry = { item: ingredient.item.trim(), units: new Map(), notes: [] };
        items.set(key, entry);
      }
      const parsed = parseQuantity(ingredient.quantity);
      if (parsed) {
        const unit = normalizeUnit(parsed.unit);
        entry.units.set(unit, (entry.units.get(unit) ?? 0) + parsed.amount);
      } else if (ingredient.quantity) {
        const note = ingredient.quantity.trim();
        if (!entry.notes.includes(note)) entry.notes.push(note);
      }
    }
  }

  return [...items.values()]
    .map(({ item, units, notes }) => ({
      item,
      quantities: [
        ...[...units.entries()].map(([unit, amount]) => formatQuantity(amount, unit)),
        ...notes,
      ],
    }))
    .sort((a, b) => a.item.localeCompare(b.item, 'en'));
}
