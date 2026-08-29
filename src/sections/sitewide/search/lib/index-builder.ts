/**
 * Search index builder, runs at build time, turns every enabled module's
 * content collection plus the registry's own pages into compact search
 * documents. Consumes only the public content-collection API
 * (`getCollection`) and the section registry, no module internals are
 * imported (the soul-path mapping below is a deliberate local copy, per the
 * no-module→module-imports rule).
 *
 * Document fields are single letters to respect the size budget; the island
 * configures Fuse.js with the same key names.
 */
import { getCollection } from 'astro:content';
import { SITE } from '../../../../config/site';
import { enabledModules, isModuleEnabled, pillars, getSection } from '../../../../config/sections';

export interface SearchDoc {
  /** Title. */
  t: string;
  /** Description / excerpt. */
  d: string;
  /** Site-absolute URL. */
  u: string;
  /** Section label ("Yoga", "Recipes", "Pages"…). */
  c: string;
  /** Extra keywords (space-joined), Sanskrit names, tags, deities. */
  k: string;
}

export interface IndexChunk {
  id: string;
  docs: SearchDoc[];
}

const clip = (text: string, max = 180): string =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

/** soul-teachings → owning module ids (local copy of the soul paths map). */
const SOUL_PATH_MODULE: Record<string, string> = {
  action: 'action',
  knowledge: 'knowledge',
  devotion: 'devotion',
  meditation: 'soul-meditation',
  tantra: 'tantra',
};

function doc(t: string, d: string, u: string, c: string, k: string[] = []): SearchDoc {
  return { t, d: clip(d), u, c, k: k.join(' ') };
}

/** Registry pages: home, pillars, module landings, planner, static pages. */
async function registryDocs(): Promise<SearchDoc[]> {
  const docs: SearchDoc[] = [
    doc('Satvik.fyi', SITE.description, '/', 'Pages', ['home', 'satvik', 'about']),
  ];

  for (const pillar of pillars) {
    docs.push(doc(pillar.title, pillar.description, pillar.routePrefix, 'Pages', [pillar.title]));
  }

  for (const module of enabledModules()) {
    docs.push(doc(module.title, module.description, module.routePrefix, 'Pages', [module.title]));
  }

  if (isModuleEnabled('meals')) {
    docs.push(
      doc(
        'Weekly Meal Planner',
        'Build a seven-day satvik meal plan that favours recipes balancing your dosha, with swaps and a shopping list.',
        '/body/meals/planner/',
        'Recipes',
        ['planner', 'meal plan', 'shopping list'],
      ),
    );
  }

  const statics: [string, string, string][] = [
    ['About Satvik.fyi', 'What this site is, the principles behind it, and how it treats the traditions.', '/about/'],
    ['Contact', 'How to reach the people behind Satvik.fyi.', '/contact/'],
    ['Privacy', 'No accounts, no trackers, no cookies; your data stays on your device.', '/privacy/'],
    ['Disclaimer', 'Educational information from traditional sources; not professional advice.', '/disclaimer/'],
  ];
  for (const [title, description, path] of statics) {
    docs.push(doc(title, description, path, 'Pages'));
  }

  return docs;
}

/** All searchable sources; each respects its module's enabled flag. */
export async function buildChunks(): Promise<IndexChunk[]> {
  const chunks: IndexChunk[] = [];

  if (isModuleEnabled('meals')) {
    const entries = await getCollection('meals-recipes');
    chunks.push({
      id: 'meals-recipes',
      docs: entries.map((entry) =>
        doc(
          entry.data.title,
          entry.data.summary,
          `/body/meals/recipes/${entry.data.slug}/`,
          'Recipes',
          [...entry.data.satvikTags, entry.data.mealType],
        ),
      ),
    });
  }

  if (isModuleEnabled('yoga')) {
    const entries = await getCollection('yoga-poses');
    chunks.push({
      id: 'yoga-poses',
      docs: entries.map((entry) =>
        doc(
          entry.data.name,
          entry.data.summary,
          `/body/yoga/${entry.data.slug}/`,
          'Yoga',
          [entry.data.sanskritName, entry.data.category, entry.data.level, ...entry.data.associatedDoshas],
        ),
      ),
    });
  }

  if (isModuleEnabled('ayurveda')) {
    const entries = await getCollection('ayurveda-entries');
    chunks.push({
      id: 'ayurveda-entries',
      docs: entries.map((entry) =>
        doc(
          entry.data.name,
          entry.data.summary,
          `/body/ayurveda/${entry.data.slug}/`,
          'Ayurveda',
          [entry.data.sanskritName ?? '', entry.data.kind, ...entry.data.tastes].filter(Boolean),
        ),
      ),
    });
  }

  if (isModuleEnabled('pranayama')) {
    const entries = await getCollection('pranayama-techniques');
    chunks.push({
      id: 'pranayama-techniques',
      docs: entries.map((entry) =>
        doc(
          entry.data.name,
          entry.data.summary,
          `/mind/pranayama/${entry.data.slug}/`,
          'Pranayama',
          [entry.data.sanskritName, entry.data.category, entry.data.level, ...entry.data.associatedDoshas],
        ),
      ),
    });
  }

  if (isModuleEnabled('meditation')) {
    const entries = await getCollection('meditation-practices');
    chunks.push({
      id: 'meditation-practices',
      docs: entries.map((entry) =>
        doc(
          entry.data.name,
          entry.data.summary,
          `/mind/meditation/${entry.data.slug}/`,
          'Meditation',
          [entry.data.sanskritName ?? '', entry.data.tradition],
        ),
      ),
    });
  }

  if (isModuleEnabled('mantras')) {
    const entries = await getCollection('mantras');
    chunks.push({
      id: 'mantras',
      docs: entries.map((entry) =>
        doc(
          entry.data.name,
          entry.data.summary,
          `/mind/mantras/${entry.data.slug}/`,
          'Mantras',
          [entry.data.deity, entry.data.tradition, entry.data.transliteration],
        ),
      ),
    });
  }

  // Soul teachings render on their path module's overview page; index each
  // teaching only while its module is enabled, linking to the on-page anchor.
  {
    const entries = await getCollection('soul-teachings');
    const docs: SearchDoc[] = [];
    for (const entry of entries) {
      const moduleId = SOUL_PATH_MODULE[entry.data.path];
      const section = moduleId ? getSection(moduleId) : undefined;
      if (!section || !section.enabled) continue;
      const route = section.routePrefix;
      docs.push(
        doc(
          entry.data.title,
          entry.data.summary,
          `${route}#teaching-${entry.data.slug}`,
          section.title,
          [entry.data.scripture, entry.data.reference],
        ),
      );
    }
    if (docs.length > 0) chunks.push({ id: 'soul-teachings', docs });
  }

  if (isModuleEnabled('blog')) {
    const entries = await getCollection('blog-posts');
    chunks.push({
      id: 'blog-posts',
      docs: entries
        .filter((entry) => !entry.data.draft)
        .map((entry) =>
          doc(
            entry.data.title,
            entry.data.excerpt,
            `/blog/${entry.data.slug}/`,
            'Blog',
            [entry.data.author, ...entry.data.tags],
          ),
        ),
    });
  }

  if (isModuleEnabled('wiki')) {
    const entries = await getCollection('wiki-articles');
    chunks.push({
      id: 'wiki-articles',
      docs: entries.map((entry) =>
        doc(
          entry.data.title,
          entry.data.summary,
          `/wiki/${entry.data.category}/${entry.data.slug}/`,
          'Wiki',
          [entry.data.category],
        ),
      ),
    });
  }

  chunks.push({ id: 'pages', docs: await registryDocs() });

  return chunks.filter((chunk) => chunk.docs.length > 0);
}

/** The merged index, what the island fetches once at /search/index.json. */
export async function mergedIndex(): Promise<SearchDoc[]> {
  const chunks = await buildChunks();
  return chunks.flatMap((chunk) => chunk.docs);
}

export function searchEnabled(): boolean {
  return isModuleEnabled('search');
}
