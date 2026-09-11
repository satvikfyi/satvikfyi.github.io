/**
 * Ingredient bridge, the two-way link between canonical recipe
 * ingredient names and wiki ingredient entries. Lives in shared (not
 * inside a module) because both the wiki module ("Used in N recipes")
 * and the meals module (forward links on recipe pages) consume it; it
 * touches only public content collections, never module internals,
 * per the no-module→module-imports rule.
 *
 * The join key is the explicit `ingredientItem` frontmatter field on a
 * wiki ingredient article: it must equal a canonical name from
 * content/recipes/ingredients.json exactly (the audited master list),
 * so links can never drift from naming — a typo simply produces no
 * link, visible in coverage. Article slugs are a human convention
 * (kebab of the canonical name minus its parenthetical gloss); the
 * runtime join never derives or depends on them.
 */
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type WikiEntry = CollectionEntry<'wiki-articles'>;
export type RecipeEntry = CollectionEntry<'meals-recipes'>;

let entryMapCache: Promise<Map<string, WikiEntry>> | null = null;

/** canonical ingredient item → wiki ingredient entry. One pass per build. */
export function ingredientEntryMap(): Promise<Map<string, WikiEntry>> {
  entryMapCache ??= (async () => {
    const articles = await getCollection(
      'wiki-articles',
      (entry) => entry.data.category === 'ingredients' && typeof entry.data.ingredientItem === 'string',
    );
    return new Map(articles.map((entry) => [entry.data.ingredientItem as string, entry]));
  })();
  return entryMapCache;
}

let usageCache: Promise<Map<string, RecipeEntry[]>> | null = null;

/**
 * canonical ingredient item → recipes using it (alphabetical). The
 * inverted map is built once per build and shared by every page, so
 * growth in recipes or entries stays linear.
 */
export function recipesUsingMap(): Promise<Map<string, RecipeEntry[]>> {
  usageCache ??= (async () => {
    const [known, recipes] = await Promise.all([ingredientEntryMap(), getCollection('meals-recipes')]);
    const byItem = new Map<string, RecipeEntry[]>([...known.keys()].map((item) => [item, []]));
    for (const recipe of recipes) {
      for (const ingredient of recipe.data.ingredients) {
        byItem.get(ingredient.item)?.push(recipe);
      }
    }
    for (const list of byItem.values()) {
      list.sort((a, b) => a.data.title.localeCompare(b.data.title, 'en'));
    }
    return byItem;
  })();
  return usageCache;
}

/** Public URL of a wiki ingredient entry (plain-URL cross-module link). */
export function wikiIngredientHref(entry: WikiEntry): string {
  return `/wiki/${entry.data.category}/${entry.data.slug}/`;
}
