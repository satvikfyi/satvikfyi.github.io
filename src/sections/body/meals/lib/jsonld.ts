/**
 * Recipe JSON-LD builder, module-local (Recipe is domain data, so the
 * builder lives here rather than in the shared jsonld helpers).
 */
import type { JsonLdObject } from '../../../../shared/seo/jsonld';
import type { Recipe } from '../schemas/recipe';
import { mealTypeLabel } from './domain';

export interface RecipeJsonLdInput {
  recipe: Recipe;
  /** Absolute site URL, e.g. "https://satvik.fyi". */
  siteUrl: string;
  /** Page path, e.g. "/body/meals/recipes/kitchari/". */
  path: string;
  siteName: string;
}

function isoDuration(minutes: number): string {
  if (minutes <= 0) return undefined as unknown as string;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 && m > 0 ? `PT${h}H${m}M` : h > 0 ? `PT${h}H` : `PT${m}M`;
}

export function recipeJsonLd({ recipe, siteUrl, path, siteName }: RecipeJsonLdInput): JsonLdObject {
  const total = recipe.prepTime + recipe.cookTime;
  const duration = isoDuration(total);
  const image = recipe.image ? `${siteUrl}/assets/images/meals/${recipe.image}` : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.summary,
    url: `${siteUrl}${path}`,
    ...(image ? { image } : {}),
    recipeCuisine: 'Indian',
    recipeCategory: mealTypeLabel[recipe.mealType],
    recipeYield: `${recipe.servings} serving${recipe.servings === 1 ? '' : 's'}`,
    ...(duration ? { totalTime: duration } : {}),
    keywords: [...recipe.satvikTags, ...recipe.seasonalSuitability].join(', '),
    recipeIngredient: recipe.ingredients.map((i) =>
      [i.quantity, i.item, i.note].filter(Boolean).join(', ').replace(/\s+, \s+/g, ', '),
    ),
    recipeInstructions: recipe.steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text,
    })),
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
  };
}
