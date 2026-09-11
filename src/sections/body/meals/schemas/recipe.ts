/**
 * Recipe schema, the Zod validation for the `meals-recipes` content
 * collection (registered in src/content.config.ts). Server-side only:
 * it imports `z` from `astro:content`, so islands must not import the
 * schema itself, they import types via `import type` (erased at build).
 */
import { z } from 'astro:content';
import { DOSHA_EFFECTS, MEAL_TYPES, SATVIK_TAGS, SEASONS } from '../lib/domain';

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ingredientSchema = z.object({
  /** Canonical name, used to group the shopping list; keep it consistent across recipes. */
  item: z.string().trim().min(1),
  /**
   * Human quantity, parseable for aggregation, e.g. "1 cup", "½ tsp", "to
   * taste". Plain counts may be written unquoted in YAML ("quantity: 6" for
   * six curry leaves); YAML then yields a number, so both types are accepted
   * and normalized to a string.
   */
  quantity: z
    .union([z.string().trim().min(1), z.number().finite()])
    .transform((value) => (typeof value === 'number' ? String(value) : value))
    .optional(),
  /** Prep note, e.g. "rinsed", "finely chopped". */
  note: z.string().trim().optional(),
});

export const sourceSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().optional(),
  /** Chapter / verse locator, e.g. "Sūtrasthāna 25". */
  reference: z.string().trim().optional(),
  url: z.string().url().optional(),
});

export const recipeSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().regex(kebab, 'kebab-case, matching the file name'),
  summary: z.string().trim().min(1),
  mealType: z.enum(MEAL_TYPES),
  /**
   * Editorial state for the gradual review described in
   * docs/recipe-review.md, recipes land as `draft` and flip to
   * `reviewed` after the family sign-off; drafts show a "Newly added"
   * marker on their detail page.
   */
  reviewStatus: z.enum(['draft', 'reviewed']).default('draft'),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(z.string().trim().min(1)).min(1),
  /** Minutes. */
  prepTime: z.number().int().min(0),
  /** Minutes. */
  cookTime: z.number().int().min(0),
  servings: z.number().int().min(1).max(12),
  satvikTags: z.array(z.enum(SATVIK_TAGS)).min(1),
  doshaEffects: z.object({
    vata: z.enum(DOSHA_EFFECTS),
    pitta: z.enum(DOSHA_EFFECTS),
    kapha: z.enum(DOSHA_EFFECTS),
  }),
  seasonalSuitability: z.array(z.enum(SEASONS)).min(1),
  dietNotes: z.string().trim().default(''),
  /** Path under /assets/images/meals/, optional. */
  image: z.string().optional(),
  videoUrl: z.string().url().optional(),
  sources: z.array(sourceSchema).min(1),
});

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeIngredient = z.infer<typeof ingredientSchema>;
export type RecipeSource = z.infer<typeof sourceSchema>;
