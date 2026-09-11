/**
 * Global site configuration.
 *
 * Single source of truth for site identity, SEO defaults, and footer
 * secondary links (Shop / Community / Newsletter placeholders).
 * No domain logic here, this file is data only.
 */

export interface FooterPlaceholderLink {
  label: string;
  /** Empty href means "not launched yet", rendered as a disabled placeholder. */
  href: string;
  note?: string;
}

export const SITE = {
  name: 'Satvik.fyi',
  title: 'Satvik.fyi: Satvik living: body, mind and soul',
  description:
    'A non-profit, ad-free introduction to the satvik lifestyle: satvik meals, yogasana, ayurveda, pranayama, mantra and the classical paths of yoga, presented with sources, Sanskrit transliteration and respect for the traditions.',
  url: 'https://satvik.fyi',
  locale: 'en',
  /** Placeholder until the mailbox is set up; update when DNS goes live. */
  contactEmail: 'hello@satvik.fyi',
  contentLicense: 'CC BY 4.0',
  /**
   * Giscus comments (GitHub Discussions). Fill repo/repoId/category/
   * categoryId from https://giscus.app once Discussions are enabled on the
   * repository, posts with `comments: true` then load their discussion
   * thread lazily. Empty strings keep the friendly "coming soon" note.
   */
  giscus: {
    repo: '',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
  },
  footer: {
    elsewhere: [
      { label: 'Newsletter', href: 'https://satvik.substack.com', note: 'free essays, no tracking' },
      { label: 'Shop', href: '', note: 'planned, external store via shop.satvik.fyi' },
      { label: 'Community', href: '', note: 'planned, external space via community.satvik.fyi' },
    ] satisfies FooterPlaceholderLink[],
  },
} as const;

export type SiteConfig = typeof SITE;
