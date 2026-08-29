/**
 * JSON-LD helpers, plain data builders, no rendering.
 * Pages pass the returned objects to BaseLayout's `jsonLd` prop.
 */

export type JsonLdObject = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

function graph(items: JsonLdObject): JsonLdObject {
  return { '@context': 'https://schema.org', ...items };
}

export function organizationJsonLd(site: {
  name: string;
  description: string;
  url: string;
}): JsonLdObject {
  return graph({
    '@type': 'NGO',
    name: site.name,
    description: site.description,
    url: site.url,
    nonprofit: true,
  });
}

export function websiteJsonLd(site: {
  name: string;
  description: string;
  url: string;
}): JsonLdObject {
  return graph({
    '@type': 'WebSite',
    name: site.name,
    description: site.description,
    url: site.url,
  });
}

export function breadcrumbJsonLd(siteUrl: string, items: BreadcrumbItem[]): JsonLdObject {
  return graph({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  });
}

export interface ArticleJsonLdInput {
  siteName: string;
  siteUrl: string;
  title: string;
  description: string;
  path: string;
  /** ISO 8601 date string. */
  datePublished?: string;
  dateModified?: string;
}

export function articleJsonLd(input: ArticleJsonLdInput): JsonLdObject {
  return graph({
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    mainEntityOfPage: `${input.siteUrl}${input.path}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    isPartOf: { '@type': 'WebSite', name: input.siteName, url: input.siteUrl },
    author: { '@type': 'Organization', name: input.siteName },
    publisher: { '@type': 'Organization', name: input.siteName },
  });
}
