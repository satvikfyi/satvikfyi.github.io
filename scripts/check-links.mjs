#!/usr/bin/env node
/**
 * check-links.mjs, CI gate: verify every internal link and local asset
 * reference in the built site resolves to a real file in dist/.
 *
 * Zero dependencies (uses only node:fs / node:path) so it runs anywhere.
 * External links, mailto:, tel:, data: and pure-fragment links are skipped, 
 * external availability is not a build concern.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found, run `npm run build` first.');
  process.exit(1);
}

/** Recursively collect built HTML files. */
function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Resolve an absolute site path like /body/meals/ to a dist file. */
function resolveSitePath(pathname) {
  const clean = posix.normalize(decodeURIComponent(pathname));
  const candidates = [];
  if (clean.endsWith('/')) {
    candidates.push(join(DIST, clean, 'index.html'));
  } else {
    candidates.push(join(DIST, clean));
    candidates.push(join(DIST, `${clean}.html`));
    candidates.push(join(DIST, clean, 'index.html'));
  }
  return candidates.some((c) => existsSync(c) && statSync(c).isFile());
}

const files = htmlFiles(DIST);
const problems = [];
const skippedExternal = new Set();
let checked = 0;

const ATTR_RE = /\b(?:href|src)\s*=\s*["']([^"']+)["']/g;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const relPath = file.slice(DIST.length);
  for (const match of html.matchAll(ATTR_RE)) {
    const url = match[1];
    if (!url) continue;

    if (url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:') || url.startsWith('tel:')) continue;
    if (url.startsWith('//') || /^https?:\/\//i.test(url)) {
      skippedExternal.add(url);
      continue;
    }

    const hashless = url.split('#')[0];
    const queryless = hashless.split('?')[0];
    if (!queryless || queryless === '') continue; // pure "#fragment" or "?query"

    if (queryless.startsWith('/')) {
      checked++;
      if (!resolveSitePath(queryless)) {
        problems.push(`${relPath}: broken internal link → ${url}`);
      }
    } else {
      // Relative reference (rare in Astro output, but verify anyway).
      const baseDir = posix.dirname(posix.join('', relPath));
      const target = posix.normalize(posix.join(baseDir, queryless));
      checked++;
      const candidates = [
        join(DIST, target),
        join(DIST, `${target}.html`),
        join(DIST, target, 'index.html'),
      ];
      if (!candidates.some((c) => existsSync(c))) {
        problems.push(`${relPath}: broken relative link → ${url}`);
      }
    }
  }
}

// Sitemap sanity: build must have emitted the sitemap index.
if (!existsSync(join(DIST, 'sitemap-index.xml'))) {
  problems.push('dist/sitemap-index.xml is missing, sitemap integration did not run.');
}

console.log(`Checked ${checked} internal link(s) across ${files.length} page(s); ${skippedExternal.size} external URL(s) skipped.`);

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log('✓ All internal links and local assets resolve.');
