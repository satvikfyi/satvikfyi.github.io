import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Wiki module (Phase 4, sitewide); the knowledge base: scriptures, books,
 * deities, worship methods and concepts, with cross-references (related
 * slugs, rendered both ways as backlinks) and an alphabetical index.
 * Authoring an article = adding one markdown file with a category.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'wiki',
  parent: null,
  title: 'Wiki',
  description:
    'The knowledge base, scriptures, books, deities, worship and core concepts, cross-referenced and cited.',
  routePrefix: '/wiki/',
  enabled: true,
  accent: 'sage',
};

export default config;
