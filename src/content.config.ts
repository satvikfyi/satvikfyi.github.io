/**
 * Central content-collection registration.
 *
 * Collections are namespaced per module (`meals-recipes`, `yoga-poses`,
 * `ayurveda-entries`, `pranayama-techniques`, `meditation-practices`,
 * `mantras`, `soul-teachings`) and their schemas live inside the module
 * that owns them, see docs/adding-a-module.md, step 4. The glob loader
 * lets content files stay inside the module folder instead of src/content/.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { recipeSchema } from './sections/body/meals/schemas/recipe';
import { poseSchema } from './sections/body/yoga/schemas/pose';
import { ayurvedaEntrySchema } from './sections/body/ayurveda/schemas/entry';
import { techniqueSchema } from './sections/mind/pranayama/schemas/technique';
import { practiceSchema } from './sections/mind/meditation/schemas/practice';
import { mantraSchema } from './sections/mind/mantras/schemas/mantra';
import { teachingSchema } from './sections/soul/paths/schemas/teaching';
import { postSchema } from './sections/sitewide/blog/schemas/post';
import { wikiArticleSchema } from './sections/sitewide/wiki/schemas/article';

const mealsRecipes = defineCollection({
  loader: glob({
    base: './src/sections/body/meals/content/recipes',
    pattern: '**/*.md',
  }),
  schema: recipeSchema,
});

const yogaPoses = defineCollection({
  loader: glob({
    base: './src/sections/body/yoga/content/poses',
    pattern: '**/*.md',
  }),
  schema: poseSchema,
});

const ayurvedaEntries = defineCollection({
  loader: glob({
    base: './src/sections/body/ayurveda/content/entries',
    pattern: '**/*.md',
  }),
  schema: ayurvedaEntrySchema,
});

const pranayamaTechniques = defineCollection({
  loader: glob({
    base: './src/sections/mind/pranayama/content/techniques',
    pattern: '**/*.md',
  }),
  schema: techniqueSchema,
});

const meditationPractices = defineCollection({
  loader: glob({
    base: './src/sections/mind/meditation/content/practices',
    pattern: '**/*.md',
  }),
  schema: practiceSchema,
});

const mantras = defineCollection({
  loader: glob({
    base: './src/sections/mind/mantras/content/mantras',
    pattern: '**/*.md',
  }),
  schema: mantraSchema,
});

const soulTeachings = defineCollection({
  loader: glob({
    base: './src/sections/soul/paths/content/teachings',
    pattern: '**/*.md',
  }),
  schema: teachingSchema,
});

const blogPosts = defineCollection({
  loader: glob({
    base: './src/sections/sitewide/blog/content/posts',
    pattern: '**/*.md',
  }),
  schema: postSchema,
});

const wikiArticles = defineCollection({
  loader: glob({
    base: './src/sections/sitewide/wiki/content/articles',
    pattern: '**/*.md',
  }),
  schema: wikiArticleSchema,
});

export const collections = {
  'meals-recipes': mealsRecipes,
  'yoga-poses': yogaPoses,
  'ayurveda-entries': ayurvedaEntries,
  'pranayama-techniques': pranayamaTechniques,
  'meditation-practices': meditationPractices,
  mantras,
  'soul-teachings': soulTeachings,
  'blog-posts': blogPosts,
  'wiki-articles': wikiArticles,
};
