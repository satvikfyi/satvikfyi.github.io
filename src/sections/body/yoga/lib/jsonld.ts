/**
 * Pose JSON-LD builder, module-local (Pose is domain data, so the builder
 * lives here rather than in the shared jsonld helpers). An asana maps most
 * naturally onto schema.org's HowTo: the steps become HowToSteps and the
 * English name carries the Sanskrit original alongside.
 */
import type { JsonLdObject } from '../../../../shared/seo/jsonld';
import type { Pose } from '../schemas/pose';
import { doshaLabel } from './domain';

export interface PoseJsonLdInput {
  pose: Pose;
  /** Absolute site URL, e.g. "https://satvik.fyi". */
  siteUrl: string;
  /** Page path, e.g. "/body/yoga/tadasana/". */
  path: string;
  siteName: string;
}

export function poseJsonLd({ pose, siteUrl, path, siteName }: PoseJsonLdInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${pose.name} (${pose.sanskritName})`,
    description: pose.summary,
    url: `${siteUrl}${path}`,
    keyword: pose.associatedDoshas.map((d) => `${doshaLabel[d]}-balancing`).join(', '),
    step: pose.steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text,
    })),
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
  };
}
