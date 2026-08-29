/**
 * Technique JSON-LD builder, module-local, mirroring the yoga module's
 * HowTo builder: a prāṇāyāma is stepwise instruction, which maps onto
 * schema.org's HowTo (per the Phase 5 SEO deliverable). Safety notes are
 * carried as keywords so the hazard surface is never lost.
 */
import type { JsonLdObject } from '../../../../shared/seo/jsonld';
import type { Technique } from '../schemas/technique';
import { categoryLabel, levelLabel } from './domain';

export interface TechniqueJsonLdInput {
  technique: Technique;
  siteUrl: string;
  path: string;
  siteName: string;
}

export function techniqueJsonLd({ technique, siteUrl, path, siteName }: TechniqueJsonLdInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${technique.name} (${technique.sanskritName})`,
    description: technique.summary,
    url: `${siteUrl}${path}`,
    keyword: [
      'pranayama',
      categoryLabel[technique.category].toLowerCase(),
      levelLabel[technique.level].toLowerCase(),
      ...technique.associatedDoshas,
      ...(technique.requiresTeacher ? ['requires a teacher'] : []),
    ].join(', '),
    step: technique.steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text,
    })),
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
  };
}
