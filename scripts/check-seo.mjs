#!/usr/bin/env node
/**
 * check-seo.mjs, CI gate for the Phase 5 SEO deliverables:
 *  - robots.txt exists and references the sitemap
 *  - sitemap-index.xml was emitted
 *  - every built page carries a canonical URL and og:image
 *  - representative pages carry the right JSON-LD types
 *    (Recipe on meals, HowTo on yoga + pranayama, Article on blog + wiki)
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const problems = [];

// robots + sitemap
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (!/sitemap:/i.test(robots)) problems.push('robots.txt does not reference the sitemap.');
if (!existsSync(join(DIST, 'sitemap-index.xml'))) problems.push('dist/sitemap-index.xml is missing.');
if (!existsSync(join(DIST, 'assets', 'og-default.png'))) problems.push('assets/og-default.png is missing.');

// Every page: canonical + og:image + og default asset reachable
function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = htmlFiles(DIST);
let missingCanonical = 0;
let missingOg = 0;
let redirects = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  // Redirect stubs of disabled modules are transport, not content; skip.
  if (/http-equiv="refresh"/i.test(html)) {
    redirects++;
    continue;
  }
  if (!/rel="canonical"/.test(html)) missingCanonical++;
  if (!/property="og:image"/.test(html)) missingOg++;
}
if (missingCanonical > 0) problems.push(`${missingCanonical} page(s) lack a canonical URL.`);
if (missingOg > 0) problems.push(`${missingOg} page(s) lack og:image.`);
console.log(`(${redirects} disabled-module redirect stub(s) skipped.)`);

// JSON-LD types on representative pages
const expectJsonLd = [
  ['body/meals/recipes/kitchari/index.html', '"@type":"Recipe"', 'Recipe JSON-LD on a recipe page'],
  ['body/yoga/tadasana/index.html', '"@type":"HowTo"', 'HowTo JSON-LD on a pose page'],
  ['mind/pranayama/nadi-shodhana/index.html', '"@type":"HowTo"', 'HowTo JSON-LD on a pranayama page'],
  ['blog/one-mala-one-month/index.html', '"@type":"Article"', 'Article JSON-LD on a blog post'],
  ['wiki/concepts/dharma/index.html', '"@type":"Article"', 'Article JSON-LD on a wiki article'],
];
for (const [page, marker, label] of expectJsonLd) {
  const full = join(DIST, page);
  if (!existsSync(full)) {
    problems.push(`expected page missing for SEO check: ${page}`);
    continue;
  }
  if (!readFileSync(full, 'utf8').includes(marker)) {
    problems.push(`${label}, marker ${marker} not found in ${page}.`);
  }
}

// Breadcrumbs (BreadcrumbList) on a couple of deep pages
for (const page of ['body/yoga/tadasana/index.html', 'wiki/concepts/dharma/index.html']) {
  if (!readFileSync(join(DIST, page), 'utf8').includes('"@type":"BreadcrumbList"')) {
    problems.push(`BreadcrumbList JSON-LD missing on ${page}.`);
  }
}

console.log(`Checked ${pages.length} page(s): canonical, og:image, JSON-LD types, robots + sitemap.`);
if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('✓ SEO checks pass.');
