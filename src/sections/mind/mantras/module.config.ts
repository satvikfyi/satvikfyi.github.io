import type { ModuleSectionConfig } from '../../../config/module';

/**
 * Mantras module (Phase 3), the mantra database: text in Devanāgarī, IAST
 * transliteration, meaning, meter and traditional usage, with optional
 * free-video embeds where a reliable one exists. Grouped listing, zero
 * client JavaScript.
 */
const config: ModuleSectionConfig = {
  kind: 'module',
  id: 'mantras',
  parent: 'mind',
  title: 'Mantras',
  description:
    'Sacred sound with Devanāgarī text, IAST transliteration, meaning and traditional usage; from the praṇava Oṁ to the Gāyatrī.',
  routePrefix: '/mind/mantras/',
  enabled: true,
  accent: 'indigo',
};

export default config;
